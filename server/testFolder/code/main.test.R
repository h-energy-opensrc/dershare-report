install.packages("rjson")
library("fireData")
devtools::install_github("Kohze/fireData")

library("rjson")
setwd('/Users/kruny1001/Desktop/idep-node/server/testFolder/code')
getwd()

response = fireData::download("https://bcloud.firebaseio.com", "chapters")
response$'-KQb5JEEs4S1LAM8EDDT'$createdAt

args <- commandArgs(trailingOnly = TRUE)
json_file <- args[1]
json_data <- fromJSON(paste(readLines(json_file), collapse=""))
names(json_data)