## At the end, you will write csv file 
load("./output/tout.RData")
write.csv(tout$Y, file = "./output/data.csv")