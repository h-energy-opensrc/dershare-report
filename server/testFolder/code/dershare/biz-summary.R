cat("== Business Analysis:  ==")

library(jsonlite)

args = commandArgs(trailingOnly=TRUE)
jsonStr = args[1]

print(jsonStr)
netCachFlow = fromJSON(jsonStr)
print(length(netCachFlow))


options("scipen"=100, "digits"=4)

cat("== NetCache.png Plot ==")
png("./output/netCach.png", width = 1024, height = 768)
plot(netCachFlow$equity, col="red", type="l", main="Net Cach Flow")
lines(netCachFlow$project, col="blue")
graphics.off()

# jsonCumul = '"cumul_cash_flow": [ { "year": 2018, "equity": 7522881.615849199, "project": 7522881.615849199 }, { "year": 2019, "equity": 19563873.027097527, "project": 19563873.027097527 }, { "year": 2020, "equity": 31604864.43834585, "project": 31604864.43834585 }, { "year": 2021, "equity": 38431320.93440466, "project": 38431320.93440466 }, { "year": 2022, "equity": 45257777.43046347, "project": 45257777.43046347 }, { "year": 2023, "equity": 50328097.6406184, "project": 50328097.6406184 }, { "year": 2024, "equity": 53903860.56712538, "project": 53903860.56712538 }, { "year": 2025, "equity": 56963054.38403645, "project": 56963054.38403645 }, { "year": 2026, "equity": 59752149.466711916, "project": 59752149.466711916 }, { "year": 2027, "equity": 62541244.54938738, "project": 62541244.54938738 }, { "year": 2028, "equity": 65330339.632062845, "project": 65330339.632062845 }, { "year": 2029, "equity": 68119434.71473832, "project": 68119434.71473832 }, { "year": 2030, "equity": 70908529.79741381, "project": 70908529.79741381 }, { "year": 2031, "equity": 73697624.8800893, "project": 73697624.8800893 }, { "year": 2032, "equity": 74655247.66510646, "project": 74655247.66510646 } ]'
# CumulCachFlow = fromJSON(jsonStr)
# plot(CumulCachFlow$equity, col="red", type="l", main="Cumulative Cach Flow")
# lines(CumulCachFlow$project, col="blue")
