library(R6)
library(dplyr)
library(RColorBrewer)
library(lubridate)

DataExploratary <- R6Class("DataExploratary",
  public = list(
    data = NULL,
    filtered = NULL,
    days = NULL,
    cols = NULL,
    acc = NULL,
    initialize = function(data){
      self$data <- data
    },
    getNADate = function(){
      data = self$data
      data$time = strptime(data$time, format="%Y-%m-%d")
      data$time = as.POSIXct(data$time, format="%Y-%m-%d")
      data = na.omit(data)
      xts1 = xts::xts(data$usage, order.by=data$time)
      groupb = data %>% group_by(time) %>% summarise(count = n())
      missingValue = groupb %>% filter(count < 96)
      return (missingValue)
    },
    
    getPlotByDays = function(range, type="max"){
      tempD = self$data
      tempD$time = strptime(tempD$time, format="%Y-%m-%d")
      tempD$time = as.POSIXct(tempD$time, format="%Y-%m-%d")
      tempD$days = wday(tempD$time, label=TRUE)
      groupb = tempD %>% group_by(time) %>% summarise(count = n())
      self$filtered = groupb %>% filter(count < 96)
      if(type == "max")
        subtotal = tempD %>% group_by(time, days) %>% 
          summarise(total = max(usage))
      else if(type == "sum")
        subtotal = tempD %>% group_by(time, days) %>% 
          summarise(total = sum(usage))
      else if(type == "min")
        subtotal = tempD %>% group_by(time, days) %>% 
          summarise(total = min(usage))
      
      cols<-brewer.pal(n=7,name="Set1")
      cols_t1<-cols[factor(subtotal$days)]
      
      #plot
      proceed = subtotal %>% arrange(days, total)
      cols_t1<-cols[factor(proceed$days)]
      self$days = factor(proceed$days)
      self$cols = cols_t1
      plot(1:length(proceed$total), proceed$total, col=cols_t1, main=paste(self$acc, type))
      legend("bottomright", legend=unique(self$days), 
        col=unique(self$cols),
        lty = 1, pch = 1,merge = TRUE)
    },
    getPlotByRange = function(acc=1216119713, range="2016") {
      temp = self$data
      temp$time = strptime(temp$time, format="%Y-%m-%d  %H:%M")
      temp$time = as.POSIXct(temp$time, format="%Y-%m-%d  %H:%M")
      xts1 = xts::xts(temp$usage, order.by=temp$time)
      plot(xts1[range])
    }
  )
)


# source("./classes/dataClass/DataClean.R")
# cleanObj1 <- DataClean$new("1216119713")
# cleanObj2 <- DataClean$new("1316121995")
# cleanObj3 <- DataClean$new("1511038083")
# 
# par(mfrow=c(3,3))
# cleanObj1$getPlot(range="", type="max")
# cleanObj2$getPlot(range="", type="max")
# cleanObj3$getPlot(range="", type="max")
# 
# cleanObj1$getPlot(range="", type="min")
# cleanObj2$getPlot(range="", type="min")
# cleanObj3$getPlot(range="", type="min")
# 
# cleanObj1$getPlot(range="", type="sum")
# cleanObj2$getPlot(range="", type="sum")
# cleanObj3$getPlot(range="", type="sum")
# 
# 
# cleanObj3 <- DataClean$new("1511038083")
# MV = cleanObj3$getNADate()
# MV %>% arrange(count)
# plot(MV)
# cleanObj3$getPlot(range="")
# df = data.frame(c(day = cleanObj1$days, col = cleanObj1$cols))
# 
# unique(cleanObj1$days)
# unique(cleanObj1$cols)
# 
