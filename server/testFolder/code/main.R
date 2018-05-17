## Required Libraries
## Delete Environment Variables
rm(list=ls())

## Import required Libraries
library(dplyr)
# library(EBImage)
library(plotly)
library(Rtsne)
library(class)

# setwd("/Users/kruny1001/Desktop/idep-node/server/testFolder/code")
## Import Source 
source('./classes.R') ## Main Implementation

print('[10] loadData')

## Set Test and Training dataset path
trainF = "./testData/final.1.csv" # unlabeled 1000 digits
testF = "./testData/final.2.csv"  # labeled 100 digits

## Instantiate DataHandler Class Object
DataObj = DataHandler$new(trainF, testF)

# dim(DataObj$trainPixels)
# dim(DataObj$testPixels)

## Evaluation Purpose 
labled.1000 = read.csv("./testData/final.1.label.csv")
lable.1000 = labled.1000$label

# DataObj$transformData() # Experimental 

### Run T-SNE
tout <- Rtsne(DataObj$trainPixels,
  check_duplicates = FALSE, pca = TRUE, 
  # eta = 30,
  dim=2, perplexity=20, verbose = F)

save(tout, file = "./output/tout.RData")
# rm(list=ls())


# ### Clustering by kmean and hclust
numCluster = 25
km.out = kmeans(scale(tout$Y), centers=numCluster, nstart=100)
km.out.clust = km.out$cluster[1:1000]

numCluster.h = 15
hclust.result = hclust(dist(scale(tout$Y)))
hclust.out = cutree(hclust.result, k=numCluster.h)

# ### Assign Label 
newLabel = vector(mode="numeric", length=1000)
for(i in 1:numCluster){
  targetLabelIdx = which(km.out.clust==i)
  # print(table(lable.1000[targetLabelIdx]))
  maxNum = as.numeric(names(table(lable.1000[targetLabelIdx]))[which.max(table(lable.1000[targetLabelIdx]))])
  newLabel[which(km.out.clust == i)] <- maxNum
  # print(paste0("[idx ", i,"] : ",maxNum))
}

newLabel2 = vector(mode="numeric", length=1000)
for(i in 1:numCluster.h){
  targetLabelIdx = which(hclust.out==i)
  maxNum = as.numeric(names(table(lable.1000[targetLabelIdx]))[which.max(table(lable.1000[targetLabelIdx]))])
  newLabel2[which(km.out.clust == i)] <- maxNum
  # print(paste0("[idx ", i,"] : ",maxNum))
}

# ## Check accuracy
table(lable.1000,newLabel)
mean(lable.1000 == newLabel)
mean(lable.1000 == newLabel2)

# ## Draw unlabeled dataset t-sne transformed 
# p <- plot_ly( x = tout$Y[,2], y = tout$Y[,3], z = tout$Y[,1],color = newLabel) %>%
#   # colors = c('#FF0000FF', '#00FFFFFF')) %>%
#   add_markers() %>%
#   layout(scene = list(xaxis = list(title = 'x'),
#     yaxis = list(title = 'y'),
#     zaxis = list(title = 'z')))
# p

# ## Draw digits 

totalN=numCluster
numr = ceiling(sqrt(numCluster))
par_temp = par()
cls <- c('white', 'black')
crp <- colorRampPalette(cls)
# dataset = DataObj$trainPixels
dataset = DataObj$trainPixels
targetIdx = km.out.clust

# ### Print
png(paste0("./output/kmean_all.png"), width = 480, height = 480)
par(mfrow=c(numr,numr), mar=c(.6,.6,2.6,.6), pty = "m")
mean_dig <- matrix(NA, nrow = totalN, ncol = 28*28) #initialize
for(digit in 1:(totalN)){
  # print(digit)
  targetLabelIdx = which(targetIdx==digit)
  mean_dig[digit, ]<- apply(dataset[targetLabelIdx,], 2, mean)
  z <- matrix(mean_dig[digit,],nrow = 28, ncol = 28,byrow = FALSE)
  z <- z[,28:1]
  image(1:28,1:28,
    z, main=digit, #col=crp(200),
    xlab="", cex=3.5,
    ylab ="",xaxt="n", yaxt="n" )
}
dev.off()
# rm(list=ls())

# ## Draw each clusters' digits 
# for(numIdx in 1:numCluster){
#   ttarget = which(km.out.clust == numIdx)
#   numr = ceiling(sqrt(length(ttarget)))
#   png(paste0("./testData/kmean_",numIdx,".png"), width = 1280, height = 1280)
#   par(mfrow=c(numr,numr), mar=c(.6,.6,2.6,.6), pty = "m")
#   for(idx in ttarget){
#     z <- matrix(as.numeric(dataset[idx,]),nrow = 28, ncol = 28,byrow = FALSE)
#     z <- z[,28:1]
#     image(1:28,1:28, z, main=idx, col = crp(200), xlab="", cex=3.5,
#       ylab ="",xaxt="n", yaxt="n")
#   }
#   dev.off()
# }

# #### Assign Unsupervised Variable 
# png(paste0("./testData/kmean_mean.png"), width = 1280, height = 200)
# DataObj$drawDigits(DataObj$trainPixels, newLabel+1, totalN=9)
# dev.off()
# png(paste0("./testData/hclust_mean.png"), width = 1280, height = 200)
# DataObj$drawDigits(DataObj$trainPixels, newLabel2+1, totalN=9)
# dev.off()
# png(paste0("./testData/manual_mean.png"), width = 1280, height = 200)
# DataObj$drawDigits(DataObj$trainPixels, lable.1000+1, totalN=9)
# dev.off()

# # Assign new labels to 1000 unlabeled data
DataObj$labels = newLabel

# ######### [END] Unsupervised Learning Section #########



wholeSet = rbind(DataObj$trainPixels, DataObj$testPixels)

# ####### [START] Supervised Learning Section #######

train = cbind(newLabel, DataObj$trainPixels)
test = cbind(DataObj$testLabels, DataObj$testPixels)

colnames(train)[1] = "label"
colnames(test)[1] = "label"

pcaObj = PCAClass$new(train, test)

# #generate PCs with 25 principal components 
# # pcaObj$buildPca(10)
# # modelObjQDA = ModelsClass$new(pcaObj)
# # myClassifier = runQDA(modelObjQDA)
# # modelObjQDA$printConfT()
# # print(myClassifier) # test error rate
# # print(1-myClassifier) # Accuracy
# #### End 


# ### Next you can run All classifiers

# ############################################################################################################################
# # Run other classifier 
# ############################################################################################################################
# #### Start 
# # You can set number of Principal Components for training a model
# # lda, qda, svm, rf, mclust run for 10, 20, 40, 60 principal components for each 


save.image(file = "./output/.RData")