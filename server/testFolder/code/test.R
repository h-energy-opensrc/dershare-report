print("load result")

attach("./output/results.10.RData")
attach("./output/results.15.RData")
attach("./output/results.20.RData")

# load(file = "./output/results.10.RData")
# print("load 25")
# load(file = "./output/results.25.RData")
# print("load 40")
# load(file = "./output/results.40.RData")
# load(file = "./output/results.60.RData")

df = data.frame(results.10)
df = rbind(df, results.15)
df = rbind(df, results.20)
# df = rbind(df, results.60)

library(data.table)
resultDT = data.table(df)
svm = resultDT[ method=="svm"]
lda = resultDT[ method=="lda"]
qda = resultDT[ method=="qda"]
mclust = resultDT[ method=="mclust"]
rf = resultDT[ method=="randomForest"]

# # Result
png("./output/final.png")
plot(lda$numPC, lda$testError, type="l", ylim=c(0,.9), 
  xlab="Number of PC", ylab="Test Error Rate", 
  main="Test Results for Different Num of PCs")
# lines(lda$numPC, lda$testError, col="blue")
lines(qda$numPC, qda$testError, col="red")
lines(mclust$numPC, mclust$testError, col="orange")
lines(rf$numPC, rf$testError, col="green")
legend('topright', c("LDA", "QDA", "Mclust", "RF"),
  cex=.7,
  lty=c(1,1,1,1,1),lwd=c(2.5,2.5,2.5,2.5,2.5),col=c("black","blue","red","orange", "green"))
dev.off()
write.table(df, file = "./output/final.csv", sep = ",", row.names=F)