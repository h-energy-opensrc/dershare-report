## Author: Eun Woo Son
library(caret)
library(methods)
library(R6)
library(data.table)
# Required Libraries
library(MASS)
library(mclust) # mclust
library(randomForest) #rf
library(class)


## Data Handling Class 
DataHandler = R6Class("DataHandler",
  # Class Member variables
  public = list(
    trainIdx = NULL,
    testIdx = NULL,
    trainPixels = NULL,
    testPixels = NULL,
    testLabels = NULL,
    allPixel = NULL,
    label.kmean = NULL,
    labels = NULL,
    transformed = NULL,
    km.out.clust = NULL,
    hclust.out = NULL,
    
    # Class Member functions
    initialize = function(trainDataFile, testDataFile) {
      print(paste("[DataHandler:init] Read ", trainDataFile, " and ", testDataFile))
      
      self$getData(trainDataFile, testDataFile)
      
      print(paste("[DataHandler:init] Total Number of pixel dataset: ", nrow(self$allPixel)))
      print(paste("                   Total Number of train dataset: ", nrow(self$trainPixels)))
      print(paste("                   Total Number of test  dataset: ", nrow(self$testPixels)))
    },
    transformData = function() {
      print(paste("[DataHandler:transformData] Start "))
      wholePixels = rbind(self$trainPixels, self$testPixels)
      for(i in 1:nrow(wholePixels)){
        # x = Image(DataObj$trainPixels[i,],dim=c(28,28), colormode="Grayscale")
        x = Image(wholePixels[i,],dim=c(28,28), colormode="Grayscale")
        sm = round(resize(x, 16)/16, 3)
        sm.v = as.vector(sm)  
        self$transformed = rbind(self$transformed, sm.v)
      }
      print(paste("[DataHandler:transformData] END dim of transformed Data", dim(self$transformed)))
    },
    getData = function(trainDataFile="./data/final.2.csv",testDataFile="./data/final.1.csv") {
      trainSet = read.csv(trainDataFile)
      testSet = read.csv(testDataFile)
      
      self$trainIdx = trainSet[,1]
      self$trainPixels = trainSet[,-1]
      
      self$testIdx = testSet[,1]
      self$testLabels = testSet[,2] # labels
      self$testPixels = testSet[,-c(1:2)]
      self$allPixel = rbind(self$trainPixels, self$testPixels)
    },
    preprocess = function(redisKey){
      self$getData()
    },
    getImage = function(idx=1) {
      target = self$allPixel[idx,] # extract record pixel information by index
      output = matrix(unlist(target) , ncol=28, byrow = T) # convert list to matrix 28 by 28
      output = output[,28:1]
      image(output)
    },
    drawDigits = function(targetData, targetLabel, totalN = 0, title){
      ## Plot the average image of each digit
      #plotting colors
      par_temp = par()
      cls <- c('white', 'black')
      crp <- colorRampPalette(cls)
      dataset = targetData
      targetIdx = targetLabel
      par(mfrow=c(1,totalN+1), mar=c(.6,.6,2.6,.6), pty = "m")
      mean_dig <- matrix(NA, nrow = 10, ncol = 28*28) #initialize
      for(digit in 0:totalN){
        targetLabelIdx = which(targetIdx==digit+1)
        mean_dig[digit+1, ]<- apply(dataset[targetLabelIdx,], 2, mean)
        z <- matrix(mean_dig[digit+1,],nrow = 28, ncol = 28,byrow = FALSE)
        z <- z[,28:1]
        image(1:28,1:28, 
          z, main=digit, col = crp(200), xlab="", cex=3.5,
          ylab ="",xaxt="n", yaxt="n" )
      }
    },
    kmeanDigit = function(targetData, nstart=20){
      km.out = kmeans(targetData, centers=10, nstart=nstart)
      self$km.out.clust = km.out$cluster
      return(self$km.out.clust)
    },
    hclustDigit = function(targetData){
      hclust.result = hclust(dist(targetData))
      self$hclust.out = cutree(hclust.result, k=10)
      return(self$hclust.out)
    }
  )
)

DataClass = setRefClass("DataClass",
                        fields = list(
                          wholeData = "data.frame",
                          train = "data.frame",
                          test = "data.frame"))
DataClass$methods( list(
  # Constructor for load data
  initialize = function() {
    cat("Data Class Object is instanticated \n")
  },
  getPreData = function(targetCol="label", part=.7){
    data1 <- read.csv("./data/final.2.csv")
    nrow(data1)
    data3 <- read.csv("./data/final.1.re.csv")
    nrow(data3)
    newSet = rbind(data1, data3)
    newSet <- newSet[, ! names(newSet) %in% c("X"), drop = F]
    .self$wholeData <- newSet
    set.seed(702)
    d = createDataPartition(y=newSet[[targetCol]], p=part, list =FALSE)
    .self$train <- newSet[d,]
    .self$test <- newSet[-d,]
  },
  getYourData = function(targetCol="label", fPath1, fPath2, part=.7){
    data1 <- read.csv(fPath1)
    nrow(data1)
    data3 <- read.csv(fPath2)
    nrow(data3)
    newSet = rbind(data1, data3)
    newSet <- newSet[, ! names(newSet) %in% c("X"), drop = F]
    .self$wholeData <- newSet
    d = createDataPartition(y=newSet[[targetCol]], p=part, list =FALSE)
    .self$train <- newSet[d,]
    .self$test <- newSet[-d,]
  },
  getNZRData = function(targetCol="label", part=.7){
    nzr <- nearZeroVar(.self$wholeData[,-1],saveMetrics=T,freqCut=10000/1,uniqueCut=1/7)
    cutvar <- rownames(nzr[nzr$nzv==TRUE,])
    var <- setdiff(names(.self$wholeData),cutvar)
    .self$train <- .self$train[,var]
    .self$test <- .self$test[,var]
  },
  ### Graphical
  getImage = function(idx=1) {
    target = .self$wholeData[idx, -1] # extract record pixel information by index
    output = matrix(unlist(target) , ncol=28, byrow = T) # convert list to matrix 28 by 28
    output = output[,28:1]
    image(output)
  },
  drawDigits = function(){
    ## Plot the average image of each digit
    #plotting colors
    cls <- c('white', 'black')
    crp <- colorRampPalette(cls)
    dataset <- .self$wholeData
    par(mfrow=c(2,5), mar=c(1,1,1,1), pty = "s")
    mean_dig <- matrix(NA, nrow = 10, ncol = 28*28) #initialize
    for(digit in 0:9){
      mean_dig[digit+1, ]<- apply(dataset[dataset[,1]==digit ,-1], 2, mean)
      z <- matrix(mean_dig[digit+1,],nrow = 28, ncol = 28,
                  byrow = FALSE)
      z <- z[,28:1]
      image(1:28,1:28, z, main=digit, col = crp(200), xlab="",
            ylab ="",xaxt="n", yaxt="n" )
    }
  }
))

PCAHandler = R6Class("PCAHandler",
  # Class Member variables
  public = list(
    rotation = NULL,
    targetPC = NULL,
    partialPC = NULL,
    initialize = function(targetPixel) {
      # Assign pixel Data Only
      self$targetPC = prcomp(targetPixel)
      self$rotation = self$targetPC$rotation
    },
    buildPca = function(targetPixel, numRange=40){
      self$partialPC <- as.matrix(targetPixel) %*% self$rotation[,1:numRange]
      return(self$partialPC)
    }
  )
)

# Principal Component Analysis Class
# It generates PC for predefined
PCAClass = setRefClass("PCAClass",
                       fields = list(
                         pca.digits = "ANY",
                         pca.train = "ANY",
                         pca.train.label = "ANY",
                         pca.test.label = "ANY",
                         pca.test = "ANY",
                         train.pixel = "data.frame",
                         test.pixel = "data.frame"))

PCAClass$methods( list(
  # Constructor for load data
  # pca only needs pixel train data set
  initialize = function(train, test) {
    # Assign pixel Data Only
    .self$train.pixel <- train[,-1]
    .self$pca.train.label <- train[,1]
    .self$pca.test.label <- test[,1]
    .self$test.pixel <- test[,-1]
    .self$pca.digits <- prcomp(.self$train.pixel)
  },
  buildPca = function(numRange=40){
    .self$pca.train <- as.matrix(.self$train.pixel) %*% .self$pca.digits$rotation[,1:numRange]
    .self$pca.test <- as.matrix(.self$test.pixel)   %*% .self$pca.digits$rotation[,1:numRange]
  }
))

ModelsClass = setRefClass("ModelsClass",
                          contains = c("DataClass"),
                          fields = list(
                            pcaObj = "ANY",
                            ldaModel = "list",
                            confT = "table",
                            svmModel = "ANY",
                            qdaModel = "list",
                            train = "data.frame",
                            test = "data.frame"
                          ))

ModelsClass$methods( list(
  initialize = function(pcaClass) {
    .self$pcaObj = pcaClass
  },
  createPCA = function() {

  },
  svmEval = function(){
    #create Training data set dataframe
    label = as.factor( .self$pcaObj$pca.train.label)
    trainSVM = data.frame(label, .self$pcaObj$pca.train)
    # create Model
    .self$svmModel = train(label~.,data=trainSVM,
                           method="svmRadial",
                           trControl=trainControl(method="cv",number=5)
                           #,tuneGrid=data.frame(sigma = 0.01104614,C = 3.5)
    )
    # achieve prediction
    pred = predict(.self$svmModel$finalModel, .self$pcaObj$pca.test, type="response")
    .self$confT = table(pred ,pcaObj$pca.test.label)
    # return test error rate
    return(mean(pred != pcaObj$pca.test.label))
  },
  ldaEval = function(){
    train.data <- data.frame(.self$pcaObj$pca.train, label=as.factor(.self$pcaObj$pca.train.label))
    mod.lda <- lda(label~., data = train.data)
    test.data <- data.frame(.self$pcaObj$pca.test, label=as.factor(.self$pcaObj$pca.test.label))
    pred = predict(mod.lda, newdata=test.data)
    .self$confT = table(pred$class, .self$pcaObj$pca.test.label)
    return(mean(pred$class != .self$pcaObj$pca.test.label))
  },
  qdaEval = function(){
    train.data <- data.frame(.self$pcaObj$pca.train, label=as.factor(.self$pcaObj$pca.train.label))
    mod.qda <- qda(label~., data = train.data)
    test.data <- data.frame(.self$pcaObj$pca.test, label=as.factor(.self$pcaObj$pca.test.label))
    pred = predict(mod.qda, newdata=test.data)
    .self$confT = table(pred$class, .self$pcaObj$pca.test.label)
    return(mean(pred$class != .self$pcaObj$pca.test.label))
  },
  mculstEval = function(){
    mod.EDDA <- MclustDA(.self$pcaObj$pca.train, as.factor(.self$pcaObj$pca.train.label), modelType = "EDDA")
    pred = predict(mod.EDDA, newdata=pcaObj$pca.test)
    .self$confT = table(pred$classification, .self$pcaObj$pca.test.label)
    return(mean(pred$classification != .self$pcaObj$pca.test.label))
  },
  rfEval = function(){
    mod.rf <- randomForest(.self$pcaObj$pca.train, as.factor(.self$pcaObj$pca.train.label),
                           xtest = .self$pcaObj$pca.test,
                           ntree=10000)
    .self$confT = table(mod.rf$test$predicted, pcaObj$pca.test.label)
    return(mean(mod.rf$test$predicted != pcaObj$pca.test.label))
  },
  ## Testing
  # return pca test dataset label
  printConfT = function(){
    return(.self$confT)
  },
  print = function(){
    return(pcaObj$pca.test.label)
  }
))

## Utility functions
runQDA <- function(modelObj){
  result = modelObj$qdaEval()
  return(result)
}

runRF <- function(modelObj){
  result = modelObj$rfEval()
  return(result)
}

runMclust <- function(modelObj){
  result = modelObj$mculstEval()
  return(result)
}


runLDA <-function(modelObj){
  result = modelObj$ldaEval()
  return(result)
}

runSVM <- function (modelObj){
  result = modelObj$svmEval()
  return(result)
}

#######
# for(pid in c(40, 50, 60, 70, 80, 90, 100)){
#   PCAObj = PCAHandler$new(DataObj$trainPixels)
#   pcs = PCAObj$buildPca(DataObj$trainPixels, numRange = pid)
#   km.out = kmeans(scale(pcs), centers=13, nstart=200)
#   km.out.clust = km.out$cluster
#   print(pid)
#   for(i in 1:13){
#     targetLabelIdx = which(km.out.clust==i)
#     print(table(lable.1000[targetLabelIdx]))
#   }  
# }

