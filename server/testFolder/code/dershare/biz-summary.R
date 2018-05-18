cat("== Business Analysis:  ==")

library(jsonlite)
library(dplyr)
options("scipen"=100, "digits"=4)

result = fromJSON('./FeasibilityStudyResult.json')

df.irr = data.frame(
  equ_irr = result$equity_irr, 
  peak_cut = result$peak_cut, 
  battery = result$battery,
  construction_cost = result$construction_cost, 
  pcs = result$pcs,
  project_irr = result$project_irr,
  idx=1:length(result$equity_irr)
)

maxNum = 10
if(length(result$id) < 10)
    maxNum = length(result$id)

# Rank IRR 
top.10.irr = df.irr %>% mutate(equ_irr = round(equ_irr, 4)) %>% 
  mutate(ranking = rank(equ_irr, ties.method = 'first')) %>% 
  arrange(desc(ranking)) %>%
  top_n(maxNum) %>% 
  mutate(ranking = 1:maxNum) 

print(top.10.irr)

cat("== NetCache.png Plot ==")

# get Equ Min and Max
maxEqu = 0
minEqu = 0
maxEqu.cum = 0
minEqu.cum = 0
maxSeason = 0

crntMix.season = min(result$summer_peak$usages[[1]]$before)
minSeason = crntMix.season

for(idx in 1:nrow(top.10.irr)){
  targetIdx = top.10.irr$idx[idx]
  crntMax = max(result$net_cash_flow[[targetIdx]])
  maxEqu = max(c(maxEqu, crntMax))
  crntMin = min(result$net_cash_flow[[targetIdx]])
  minEqu = min(c(minEqu, crntMin))
  crntMax.cum = max(result$cumul_cash_flow[[targetIdx]])
  maxEqu.cum = max(c(maxEqu.cum, crntMax.cum))
  crntMin.cum = min(result$cumul_cash_flow[[targetIdx]])
  minEqu.cum = min(c(minEqu.cum, crntMin.cum))
  
  crntMax.season = max(result$summer_peak$usages[[targetIdx]]$before)
  maxSeason = max(c(maxSeason, crntMax.season))
  crntMix.season = min(result$summer_peak$usages[[targetIdx]]$before)
  minSeason = min(c(minSeason, crntMix.season))
  crntMax.season = max(result$winter_peak$usages[[targetIdx]]$before)
  maxSeason = max(c(maxSeason, crntMax.season))
  crntMix.season = min(result$winter_peak$usages[[targetIdx]]$before)
  minSeason = min(c(minSeason, crntMix.season))
  crntMax.season = max(result$spring_fall_peak$usages[[targetIdx]]$before)
  maxSeason = max(c(maxSeason, crntMax.season))
  crntMix.season = min(result$spring_fall_peak$usages[[targetIdx]]$before)
  minSeason = min(c(minSeason, crntMix.season))
}

options("scipen"=100, "digits"=4)

for(idx in 1:nrow(top.10.irr)){
  png(paste0("./output/graphs_",idx,".png"), width=7, height=11, unit="in", res = 300)
  # net
  par(mfrow=c(3,2))
  plot(y=result$net_cash_flow[[top.10.irr$idx[idx]]]$equity, x=result$net_cash_flow[[top.10.irr$idx[idx]]]$year, type="l", 
       ylim=c(minEqu, maxEqu), 
       main=paste0("Net Cach Flow"), ylab="KRW", xlab="Year")
  # cumu
  plot(y=result$cumul_cash_flow[[top.10.irr$idx[idx]]]$equity, x=result$net_cash_flow[[top.10.irr$idx[idx]]]$year, 
       type="l", ylim=c(minEqu.cum, maxEqu.cum), 
       main="Cumulative Cash Flow", ylab="KRW", xlab="Year")
  
  
  # summer 
  plot(result$summer_peak$usages[[top.10.irr$idx[idx]]]$before, xaxt='n', type='l', 
       main="Summer Peak Usage", ylab="kWh", xlab="a day", ylim = c(minSeason, maxSeason ))
  lines(result$summer_peak$usages[[top.10.irr$idx[idx]]]$after, col="red")
  # winter
  plot(result$winter_peak$usages[[top.10.irr$idx[idx]]]$before,xaxt='n', type='l', 
       main="Winter Peak Usage", ylab="kWh", xlab="a day", ylim = c(minSeason, maxSeason ))
  lines(result$winter_peak$usages[[top.10.irr$idx[idx]]]$after, col="red")
  
  # spring fall
  plot(result$spring_fall_peak$usages[[top.10.irr$idx[idx]]]$before,xaxt='n', type='l', 
       main="S/F Peak Usage", ylab="kWh", xlab="a day", ylim = c(minSeason, maxSeason ))
  lines(result$spring_fall_peak$usages[[top.10.irr$idx[idx]]]$after, col="red")
  dev.off()
}

cat("== Format ==")
formated.top10 = format(top.10.irr, digits=2, nsmall=3)
numbs2format <- 
  top.10.irr[, (sapply(top.10.irr, function(x) isTRUE(sum(x %% 1) > 0)))]
# ignore the warnings from trying to use %% on non-numerics
other.columns <- 
  top.10.irr[, (sapply(top.10.irr, function(x) !isTRUE(sum(x %% 1) > 0)))]

formated.top10 = cbind(other.columns, format(numbs2format, digits=2, nsmall=2))

write.csv(formated.top10, "./output/bizSum.csv", row.names = F)

cat("== DONE ==")
