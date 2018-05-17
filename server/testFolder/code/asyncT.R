
#!/usr/bin/env Rscript
args = commandArgs(trailingOnly=TRUE)

fileName = paste0("./output/asyncT", args[1], ".png")
png(fileName)
plot(sample(1:1226,100,replace=T), main=paste('plot', args[1]))
graphics.off()
print(paste(args[1], "plot created"))