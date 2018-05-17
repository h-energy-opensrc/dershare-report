source("./classes/dataClass/DataClean.R")
source("./classes/dataClass/DataExploratary.R")


cleanObj <- DataClean$new("1216119713")
exp <- DataExploratary$new(cleanObj$data)

exp$getPlotByDays('2016-01', type="max")
exp$getPlotByDays('2016-01', type="min")
exp$getPlotByDays('2016-01', type="sum")
