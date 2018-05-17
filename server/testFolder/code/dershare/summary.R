cat("== Summary of Time Series ==")

source("./classes/dataClass/DataClean.R")
source("./classes/dataClass/DataExploratary.R")

args = commandArgs(trailingOnly=TRUE)
jsonStr1 = args[1]
cat(jsonStr1)
cat("\n")
jsonStr2 = args[2]
cat(jsonStr2)

cleanObj <- DataClean$new("1216119713")
exp <- DataExploratary$new(cleanObj$data)

cat("== Min, Max, Sum Plot ==")

png("./output/maxByDays.png")
exp$getPlotByDays('2016-01', type="max")
graphics.off()

png("./output/minByDays.png")
exp$getPlotByDays('2016-01', type="min")
graphics.off()
png("./output/sumByDays.png")
exp$getPlotByDays('2016-01', type="sum")
graphics.off()

cat("== Yearly Plot ==")
png("./output/year_2015.png", width = 1024, height = 768)
exp$getPlotByRange(range='2015')
graphics.off()

png("./output/year_2016.png", width = 1024, height = 768)
exp$getPlotByRange(range='2016')
graphics.off()

png("./output/year_2017.png", width = 1024, height = 768)
exp$getPlotByRange(range='2017')
graphics.off()

png("./output/year_2018.png", width = 1024, height = 768)
exp$getPlotByRange(range='2018')
graphics.off()

cat("== Done ==")