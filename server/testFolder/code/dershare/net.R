library(jsonlite)
library(dplyr)

result = fromJSON('./FeasibilityStudyResult.json')

df.irr = data.frame(equ.irr = result$equity_irr, idx=1:length(result$equity_irr))

# Rank IRR 
top.10.irr = df.irr %>% mutate(equ.irr = round(equ.irr, 4)) %>% 
  mutate(ranking = rank(equ.irr, ties.method = 'first')) %>% 
  arrange(desc(ranking)) %>%
  top_n(10) %>% 
  mutate(ranking = 1:10) 

print(top.10.irr)

# get Equ Min and Max
maxEqu = 0
minEqu = 0
maxEqu.cum = 0
minEqu.cum = 0

for(idx in 1:nrow(top.10.irr)){
  crntMax = max(result$net_cash_flow[[idx]])
  maxEqu = max(c(maxEqu, crntMax))
  crntMin = min(result$net_cash_flow[[idx]])
  minEqu = min(c(minEqu, crntMin))
  crntMax.cum = max(result$cumul_cash_flow[[idx]])
  maxEqu.cum = max(c(maxEqu.cum, crntMax.cum))
  crntMin.cum = min(result$cumul_cash_flow[[idx]])
  minEqu.cum = min(c(minEqu.cum, crntMin.cum))
}

options("scipen"=100, "digits"=4)
plot(result$net_cash_flow[[1]]$equity, 
     type="l", ylim=c(minEqu, maxEqu), 
      ylab="Equity Net Cash Flow", 
      main=paste0("Net Cach Flow Equity IRR: ",top.10.irr$equ.irr[idx]))
graphics.off()
for(idx in 2:nrow(top.10.irr)){
  # net
  lines(result$net_cash_flow[[idx]]$equity, type="l")
  # cumu
  # summer 
  # winter
  # spring fall
}

for(idx in 1:nrow(top.10.irr)){
  png(paste0("graphs_",idx,".png"), width=800, height=1200, unit="px")
  # net
  par(mfrow=c(3,2))
  plot(y=result$net_cash_flow[[idx]]$equity, x=result$net_cash_flow[[idx]]$year, type="l", 
       ylim=c(minEqu, maxEqu),
       main=paste0("Net Cach Flow"), ylab="KRW", xlab="Year")
  # cumu
  plot(y=result$cumul_cash_flow[[idx]]$equity, x=result$net_cash_flow[[idx]]$year, 
       type="l", ylim=c(minEqu.cum, maxEqu.cum), 
       main="Cumulative Cash Flow", ylab="KRW", xlab="Year")
  # summer 
  plot(result$summer_peak$usages[[idx]]$before, xaxt='n', type='l', 
       main="Summer Peak Usage", ylab="kWh", xlab="a day")
  lines(result$summer_peak$usages[[idx]]$after, col="red")
  # winter
  plot(result$winter_peak$usages[[idx]]$before,xaxt='n', type='l', 
       main="Winter Peak Usage", ylab="kWh", xlab="a day")
  lines(result$winter_peak$usages[[idx]]$after, col="red")
  
  # spring fall
  plot(result$spring_fall_peak$usages[[idx]]$before,xaxt='n', type='l', 
       main="S/F Peak Usage", ylab="kWh", xlab="a day")
  lines(result$spring_fall_peak$usages[[idx]]$after, col="red")
  dev.off()
}
