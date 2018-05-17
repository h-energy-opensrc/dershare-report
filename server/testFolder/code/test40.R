source('./classes.R') ## Main Implementation
load("./output/.RData")

pcaObj = PCAClass$new(train, test)
testCases = c(40) #25, 30, 40) #, 50, 60, 70, 80)
results <- data.frame(numPC = numeric(0), testErr=numeric(0), accuracy=numeric(0), knn=numeric(0),method=character(0))
for(idx in testCases) {
  cat("PC ", idx,"\n")
  #Build PCA values 
  pcaObj$buildPca(idx)
  # Create Model object
  # assign pca object to compute test error rate for each statistical model 
  modelObj = ModelsClass$new(pcaObj)
  # resultSVM =runSVM(modelObj)
  resultSVM = 0
  modelObj$printConfT()
  resultLDA = runLDA(modelObj)
  modelObj$printConfT()
  resultMclust = runMclust(modelObj)
  modelObj$printConfT()
  resultRF = runRF(modelObj)
  modelObj$printConfT()
  if(idx < 50)  #qda is not working for the small test set 
    resultQDA = runQDA(modelObj)
  cat('numPC:  SVM          LDA           QDA       Mclust    Random Forest \n')
  cat(idx,': ',resultSVM," ",resultLDA, " ", resultQDA, " ", resultMclust," ", resultRF,'\n')
  results = rbind(results, data.frame(numPC = idx, testError=resultSVM, accuracy=1-resultSVM, method="svm"))
  results = rbind(results, data.frame(numPC = idx, testError=resultLDA, accuracy=1-resultLDA, method="lda"))
  results = rbind(results, data.frame(numPC = idx, testError=resultMclust, accuracy=1-resultMclust, method="mclust"))
  results = rbind(results, data.frame(numPC = idx, testError=resultRF, accuracy=1-resultRF, method="randomForest"))
  if(idx < 50)
    results = rbind(results, data.frame(numPC = idx, testError=resultQDA,accuracy=1-resultQDA, method="qda"))
}

resultDT = data.table(results)
svm = resultDT[ method=="svm"]
lda = resultDT[ method=="lda"]
qda = resultDT[ method=="qda"]
mclust = resultDT[ method=="mclust"]
rf = resultDT[ method=="randomForest"]

# # Result
# svg("./output/final.svg", width=10, height=8)
# plot(svm$numPC, svm$testError, type="l", ylim=c(0,.9), 
#   xlab="Number of PC", ylab="Test Error Rate", 
#   main="Test Results for Different Num of PCs")
# lines(lda$numPC, lda$testError, col="blue")
# lines(qda$numPC, qda$testError, col="red")
# lines(mclust$numPC, mclust$testError, col="orange")
# lines(rf$numPC, rf$testError, col="green")
# legend(42, .6, c("SVM","LDA", "QDA", "Mclust", "RF"),
#   cex=.7,
#   lty=c(1,1,1,1,1),lwd=c(2.5,2.5,2.5,2.5,2.5),col=c("black","blue","red","orange", "green"))
# dev.off()

# ### KNN
# K <- c(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 20, 60, 100, 200)
# resultsKNN <- data.frame(numPC = numeric(0), testErr=numeric(0), 
#   accuracy=numeric(0), knn=numeric(0), method=character(0))
# pcs = c(10, 15, 20, 25, 30, 40, 50, 60, 80)
# for(idx in pcs){
#   pcaObj$buildPca(idx)
#   for(k in K) {
#     mod.knn <- knn(pcaObj$pca.train, pcaObj$pca.test, pcaObj$pca.train.label, k = k)
#     resultKNN <- mean(mod.knn != pcaObj$pca.test.label)
#     resultsKNN = rbind(resultsKNN, data.frame(numPC = idx, testError=resultKNN, accuracy=1-resultKNN, knn= k, method="knn"))
#   }
# }

# bestK <- which.min(resultsKNN$testError)
# resultsKNN[bestK,]
# knnDT = data.table(resultsKNN)
# knn1 = knnDT[ knn==1]
# svg("./output/knn.svg", width=10, height = 7)
# plot(knnDT[ knn==1]$numPC, knnDT[ knn==1]$accuracy, type='l', ylim=c(.4, .96), 
#   main="KNN CV for different Num PC", xlab="number of PC", ylab="Accuracy")
# points(knnDT[ knn==1]$numPC, knnDT[ knn==1]$accuracy, col="red")
# lines(knnDT[ knn==2]$numPC, knnDT[ knn==2]$accuracy)
# points(knnDT[ knn==2]$numPC, knnDT[ knn==2]$accuracy, col="orange")
# lines(knnDT[ knn==3]$numPC, knnDT[ knn==3]$accuracy)
# points(knnDT[ knn==3]$numPC, knnDT[ knn==3]$accuracy, col="blue")
# lines(knnDT[ knn==4]$numPC, knnDT[ knn==4]$accuracy)
# points(knnDT[ knn==4]$numPC, knnDT[ knn==4]$accuracy, col="green")
# lines(knnDT[ knn==5]$numPC, knnDT[ knn==5]$accuracy)
# points(knnDT[ knn==5]$numPC, knnDT[ knn==5]$accuracy, col="brown")
# lines(knnDT[ knn==6]$numPC, knnDT[ knn==6]$accuracy)
# points(knnDT[ knn==6]$numPC, knnDT[ knn==6]$accuracy, col="yellow")
# lines(knnDT[ knn==7]$numPC, knnDT[ knn==7]$accuracy)
# points(knnDT[ knn==7]$numPC, knnDT[ knn==7]$accuracy, col="gray")
# legend("bottomright",.8, c("k=1","k=2", "k=3", "k=4", "k=5", "k=6", "k=7"),
#   lty=c(1,1,1,1,1,1,1),lwd=c(2.5,2.5,2.5,2.5,2.5,2.5,2.5),
#   col=c("red","orange","blue","green", "brown", "yellow", "gray"))
# dev.off()
# #### end


# ## Check Results
# print(results)
# print(resultsKNN)
# results[which.max(results$accuracy),]
# max(resultsKNN$accuracy)
# resultsKNN[which.max(resultsKNN$accuracy),]

results.40 = results
save(results.40, file = "./output/results.40.RData")
# ## Check Results
# print(results)
# print(resultsKNN)
# results[which.max(results$accuracy),]
# max(resultsKNN$accuracy)
# resultsKNN[which.max(resultsKNN$accuracy),]
