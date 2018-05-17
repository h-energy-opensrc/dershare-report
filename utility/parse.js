var str1 = '!LOG: Load Images'
if(str1.match('!LOG')) {
    var msgs = {
        type: 'log',
        msg: str1.replace('!LOG:','').trim()
    }    
    console.log(msgs)
}