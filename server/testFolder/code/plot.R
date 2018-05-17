load("./output/tout.RData")
png("./output/plot.png")
plot(tout$Y[,1], tout$Y[,2])
dev.off()