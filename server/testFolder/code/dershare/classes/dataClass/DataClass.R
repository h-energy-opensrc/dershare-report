# DataClass 

## Extract Data by time range 
## Data Cleaning 
## Data Summarize 



#* @filter cors
cors <- function(res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  plumber::forward()
}

#' Echo the parameter that was sent in
#' @param msg The message to echo back.
#' @get /ts
function(msg="", idx=1, year="2017-01"){
  fileName = paste0("./data/",target[idx], ".na.csv")
  data = read.csv(fileName)
  data$time = strptime(data$time, format="%Y-%m-%d  %H:%M")
  data$time = as.POSIXct(data$time, format="%Y-%m-%d  %H:%M")
  xts1 = xts::xts(data$usage, order.by=data$time)
  data.frame(date=index(xts1[year]), usage= coredata(xts1[year]))
}

# https://github.com/trestletech/plumber/issues/79

#' Echo the parameter that was sent in
#' @param msg The message to echo back.
#' @param idx The message to echo back.
#' @param start The message to echo back.
#' @param end The message to echo back.
#' @get /tsPng/<start>
#' @png (width = 1400, height = 500)
function(msg="", idx=2, start="2016"){
  # idx = as.numeric(idx)
  # print(target[idx])
  # print(getwd())
  # fileName = paste0(getwd(),"/data/",target[idx], ".na.csv")
  # data = read.csv(fileName)
  # data$time = strptime(data$time, format="%Y-%m-%d  %H:%M")
  # data$time = as.POSIXct(data$time, format="%Y-%m-%d  %H:%M")
  # xts1 = xts::xts(data$usage, order.by=data$time)
  # print(plot(xts1[start]))
}

#' Echo the parameter that was sent in
#' @param msg The message to echo back.
#' @get /tsGraph/<idx>/<start>/<end>
#' @serializer htmlwidget
function(msg="", idx=1, start="2017", end="2018"){
  # range = paste0(start,"/",end)
  # idx = as.numeric(idx)
  # print(target[idx])
  # print(getwd())
  # fileName = paste0(getwd(),"/data/",target[idx], ".na.csv")
  # print(fileName)
  # data = read.csv(fileName)
  # data$time = strptime(data$time, format="%Y-%m-%d  %H:%M")
  # data$time = as.POSIXct(data$time, format="%Y-%m-%d  %H:%M")
  # xts1 = xts::xts(data$usage, order.by=data$time)
  # df = data.frame(date=index(xts1[range]), usage=coredata(xts1[range]))
  # plot_ly(
  #   mode="lines",
  #   x = df$date,
  #   y = df$usage,
  #   connectgaps = TRUE
  # )
}