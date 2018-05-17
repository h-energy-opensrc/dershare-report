
setwd("C:/Users/Xijin.Ge/Google Drive/research/Shiny/iDEP R Notebook")
library(RSQLite,verbose=FALSE)	# for database connection
library(gplots,verbose=FALSE)		# for hierarchical clustering
library(ggplot2,verbose=FALSE)	# graphics
library(e1071,verbose=FALSE) 		# computing kurtosis
library(DT,verbose=FALSE) 		# for renderDataTable
library(plotly,verbose=FALSE) 	# for interactive heatmap
library(reshape2,verbose=FALSE) 	# for melt correlation matrix in heatmap


################################################################
# 1. Global variables
################################################################

pdf(NULL) # this prevents error Cannot open file 'Rplots.pdf'
Min_overlap <- 2
minSetSize = 3; 
mappingCoverage = 0.60 # 60% percent genes has to be mapped for confident mapping
mappingEdge = 0.5  # Top species has 50% more genes mapped
PvalGeneInfo = 0.05; minGenes = 10 # min number of genes for ploting
kurtosis.log = 50  # log transform is enforced when kurtosis is big
kurtosis.warning = 10 # log transformation recommnded 
minGenesEnrichment = 2 # perform GO or promoter analysis only if more than this many genes
PREDA_Permutations =1000
maxGeneClustering = 12000  # max genes for hierarchical clustering and k-Means clustering. Slow if larger
maxGeneWGCNA = 2000 # max genes for co-expression network
maxFactors =6  # max number of factors in DESeq2 models
set.seed(2) # seed for random number generator
mycolors = sort(rainbow(20))[c(1,20,10,11,2,19,3,12,4,13,5,14,6,15,7,16,8,17,9,18)] # 20 colors for kNN clusters
#Each row of this matrix represents a color scheme;

hmcols <- colorRampPalette(rev(c("#D73027", "#FC8D59", "#FEE090", "#FFFFBF",
"#E0F3F8", "#91BFDB", "#4575B4")))(75)
heatColors = rbind(      greenred(75),     bluered(75),     colorpanel(75,"green","black","magenta"),colorpanel(75,"blue","yellow","red"),hmcols )
rownames(heatColors) = c("Green-Black-Red","Blue-White-Red","Green-Black-Magenta","Blue-Yellow-Red","Blue-white-brown")
colorChoices = setNames(1:dim(heatColors)[1],rownames(heatColors)) # for pull down menu



################################################################
#  2. Read data files
################################################################
input_goButton = 0    # if 1, use demo data file
demoDataFile2 = "BcellGSE71176_p53.csv"
input_missingValue ="geneMedian"
input_dataFileFormat = 2
input_lowFilter = .5
input_NminSamples2=1
input_logStart = 1
input_transform = TRUE
input_minCounts =1 
input_countsLogStart =4

readData <- function(inFile ) {

				# these packages moved here to reduce loading time
				library(edgeR,verbose=FALSE) # count data D.E.
				library(DESeq2,verbose=FALSE) # count data analysis

				dataTypeWarning =0
				dataType =c(TRUE)

				#---------------Read file
				x <- read.csv(inFile)	# try CSV
				if(dim(x)[2] <= 2 )   # if less than 3 columns, try tab-deliminated
					x <- read.table(inFile, sep="\t",header=TRUE)	
				#-------Remove non-numeric columns, except the first column
				
				for(i in 2:dim(x)[2])
					dataType = c( dataType, is.numeric(x[,i]) )
				if(sum(dataType) <=2) return (NULL)  # only less than 2 columns are numbers
				x <- x[,dataType]  # only keep numeric columns
				
				# rows with all missing values
				ix = which( apply(x[,-1],1, function(y) sum( is.na(y) ) ) != dim(x)[2]-1 )
				x <- x[ix,]
				
				dataSizeOriginal = dim(x); dataSizeOriginal[2] = dataSizeOriginal[2] -1
				
				x[,1] <- toupper(x[,1])
				x[,1] <- gsub(" ","",x[,1]) # remove spaces in gene ids
				x = x[order(- apply(x[,2:dim(x)[2]],1,sd) ),]  # sort by SD
				x <- x[!duplicated(x[,1]) ,]  # remove duplicated genes
				rownames(x) <- x[,1]
				x <- as.matrix(x[,c(-1)])
				
				# remove "-" or "." from sample names
				colnames(x) = gsub("-","",colnames(x))
				colnames(x) = gsub("\\.","",colnames(x))

				
				#cat("\nhere",dim(x))
				# missng value for median value
				if(sum(is.na(x))>0) {# if there is missing values
					if(input_missingValue =="geneMedian") { 
						rowMedians <- apply(x,1, function (y)  median(y,na.rm=T))
						for( i in 1:dim(x)[2] ) {
							ix = which(is.na(x[,i]) )
							x[ix,i] <- rowMedians[ix]						
						}
							
					} else if(input_missingValue =="treatAsZero") {
						x[is.na(x) ] <- 0					
					} else if (input_missingValue =="geneMedianInGroup") {
						sampleGroups = detectGroups( colnames(x))
						for (group in unique( sampleGroups) ){		
							samples = which( sampleGroups == group )
							rowMedians <- apply(x[,samples, drop=F],1, function (y)  median(y,na.rm=T))
							for( i in  samples ) { 
								ix = which(is.na(x[ ,i] ) )	
								if(length(ix) >0 )
									x[ix, i  ]  <- rowMedians[ix]
							}										
						}
						
						# missing for entire sample group, use median for all samples
						if(sum(is.na(x) )>0 ) { 
							rowMedians <- apply(x,1, function (y)  median(y,na.rm=T))
							for( i in 1:dim(x)[2] ) {
								ix = which(is.na(x[,i]) )
								x[ix,i] <- rowMedians[ix]						
							}						
						}
					}
				}

				# Compute kurtosis
				mean.kurtosis = mean(apply(x,2, kurtosis),na.rm=T)
				rawCounts = NULL
				pvals= NULL
				if (input_dataFileFormat == 2 ) {  # if FPKM, microarray

					if ( is.integer(x) ) dataTypeWarning = 1;  # Data appears to be read counts

					#-------------filtering
					#tem <- apply(x,1,max)
					#x <- x[which(tem > input_lowFilter),]  # max by row is at least 
					x <- x[ which( apply( x, 1,  function(y) sum(y >= input_lowFilter)) >= input_NminSamples2 ) , ] 

					
					x <- x[which(apply(x,1, function(y) max(y)- min(y) ) > 0  ),]  # remove rows with all the same levels

					#--------------Log transform
					# Takes log if log is selected OR kurtosis is big than 100
					if ( (input_transform == TRUE) | (mean.kurtosis > kurtosis.log ) ) 
						x = log(x+abs( input_logStart),2)

					tem <- apply(x,1,sd) 
					x <- x[order(-tem),]  # sort by SD

				} else 
					if( input_dataFileFormat == 1) {  # counts data

					tem = input_CountsDEGMethod; tem = input_countsTransform
					# data not seems to be read counts
					if(!is.integer(x) & mean.kurtosis < kurtosis.log ) {
						dataTypeWarning = -1
					}
					# not used as some counts data like those from CRISPR screen
					#validate(   # if Kurtosis is less than a threshold, it is not read-count
					#	need(mean.kurtosis > kurtosis.log, "Data does not seem to be read count based on distribution. Please double check.")
					# )
					x <- round(x,0) # enforce the read counts to be integers. Sailfish outputs has decimal points.
					#x <- x[ which( apply(x,1,max) >= input_minCounts ) , ] # remove all zero counts
					

					# remove genes if it does not at least have minCounts in at least NminSamples
					#x <- x[ which( apply(x,1,function(y) sum(y>=input_minCounts)) >= input_NminSamples ) , ]  # filtering on raw counts
					# using counts per million (CPM) for filtering out genes.
                                             # CPM matrix                  #N samples > minCounts
					x <- x[ which( apply( cpm(DGEList(counts = x)), 1,  
							function(y) sum(y>=input_minCounts)) >= input_NminSamples ) , ] 
					


					rawCounts = x; # ??? 
					# construct DESeqExpression Object
					# colData = cbind(colnames(x), as.character(detectGroups( colnames(x) )) )
					tem = rep("A",dim(x)[2]); tem[1] <- "B"   # making a fake design matrix to allow process, even when there is no replicates
					colData = cbind(colnames(x), tem )
					colnames(colData)  = c("sample", "groups")
					dds <- DESeqDataSetFromMatrix(countData = x, colData = colData, design = ~ groups)
					dds <- estimateSizeFactors(dds) # estimate size factor for use in normalization later for started log method


					# regularized log  or VST transformation
					if( input_CountsTransform == 3 ) { # rlog is slow, only do it with 10 samples
						if(dim(x)[2]<=20 ) { 
						 x <- rlog(dds, blind=TRUE); x <- assay(x) } else 
						 x <- log2( counts(dds, normalized=TRUE) + input_countsLogStart ) 
						 }  

						else {
						if ( input_CountsTransform == 2 ) {    # vst is fast but aggressive
							x <- vst(dds, blind=TRUE)
							x <- assay(x)  
						} else{  # normalized by library sizes and add a constant.
							x <- log2( counts(dds, normalized=TRUE) + input_countsLogStart )   # log(x+c) 
							# This is equivalent to below. But the prior counts is more important
							#x <- cpm(DGEList(counts = x),log=TRUE, prior.count=input_countsLogStart )  #log CPM from edgeR
							#x <- x-min(x)  # shift values to avoid negative numbers
						}
					}
				} else 
					if( input_dataFileFormat == 3)	{  # other data type

						#neg_lfc neg_fdr pos_lfc pos_fdr 
						#11       1      11       1 
						
						n2 = ( dim(x)[2] %/% 2) # 5 --> 2
						# It looks like it contains P values
						# ranges of columns add 0.2 and round to whole. For P value columns this should be 1
						tem = round( apply(x, 2, function( y) max(y)- min(y))  + .2)     
						if( sum(tem[(1:n2)*2  ] ==  1 ) == n2 | 
							sum(tem[(1:n2)*2-1  ] ==  1 ) == n2 ) { 		
							x = x[,1:(2*n2) ,drop=FALSE ] # if 5, change it to 4			
							if(tem[2] == 1) { # FDR follows Fold-change
								pvals = x [,2*(1:n2 ),drop=FALSE ]  # 2, 4, 6
								x = x[, 2*(1:n2 )-1,drop=FALSE]   # 1, 3, 5

							} else {	# FDR follows Fold-change
								pvals = x [,2*(1:n2 )-1,drop=FALSE ]  # 2, 4, 6		
								x = x[, 2*(1: n2 ),drop=FALSE]   # 1, 3, 5
							}
						}
					ix =  which(apply(x,1, function(y) max(y)- min(y) ) > 0  )
					x <- x[ix,]  # remove rows with all the same levels
					if(!is.null(pvals) )
						pvals = pvals[ix,]
						
					}
					
					
				dataSize = dim(x);
				if(!(dim(x)[1]>5 & dim(x)[2]>1)) 
				stop ( "Data file not recognized. Please double check.")
			
	sampleInfoDemo=NULL
	if( input_goButton >0)
		sampleInfoDemo <- t( read.csv(demoDataFile2,row.names=1,header=T,colClasses="character") )
	finalResult <- list(data = as.matrix(x), mean.kurtosis = mean.kurtosis, rawCounts = rawCounts, dataTypeWarning=dataTypeWarning, dataSize=c(dataSizeOriginal,dataSize),sampleInfoDemo=sampleInfoDemo, pvals =pvals )
				return(finalResult)
}

readSampleInfo <- function(inFile){
	dataTypeWarning =0
	dataType =c(TRUE)
	#---------------Read file
	x <- read.csv(inFile,row.names=1,header=T,colClasses="character")	# try CSV
	if(dim(x)[2] <= 2 )   # if less than 3 columns, try tab-deliminated
	x <- read.table(inFile, row.names=1,sep="\t",header=TRUE,colClasses="character")
	
	# remove "-" or "." from sample names
	colnames(x) = gsub("-","",colnames(x))
	colnames(x) = gsub("\\.","",colnames(x))

	#----------------Matching with column names of expression file
	ix = match(toupper(colnames(readData.out$data)), toupper(colnames(x)) ) 
	ix = ix[which(!is.na(ix))] # remove NA

	if(! ( length(unique(ix) ) == dim(readData.out$data)[2] 
		& dim(x)[1]>=1 & dim(x)[1] <500 ) ) # at least one row, it can not be more than 500 rows
		stop( "Error!!! Sample information file not recognized. Sample names must be exactly the same. Each row is a factor. Each column represent a sample.  Please see documentation on format.")

	#-----------Double check factor levels, change if needed
	# remove "-" or "." from factor levels
	for( i in 1:dim(x)[1]) {
		x[i,] = gsub("-","",x[i,])
		x[i,] = gsub("\\.","",x[i,])
	}
	
	# if levels from different factors match
	if( length(unique(ix) ) == dim(readData.out$data)[2]) { # matches exactly
		x = x[,ix]
		# if the levels of different factors are the same, it may cause problems
		if( sum( apply(x, 1, function(y) length(unique(y)))) > length(unique(unlist(x) ) ) ) {
			tem2 =apply(x,2, function(y) paste0( names(y),y)) # factor names are added to levels
			rownames(tem2) = rownames(x)
			x <- tem2				
		}
		return(t( x ) )
	} else return(NULL)				
}

readData.out <- readData("BcellGSE71176_p53.csv")
readSampleInfo.out <- readSampleInfo("BcellGSE71176_p53_sampleInfo.csv")

