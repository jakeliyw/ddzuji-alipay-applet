export default {
    //加密
    onEncrypt: function (obj,str) {
        my.rsa({
            action: 'encrypt',
            text: str,
            //设置公钥
            key: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDB1aUXTltvHzMxWleR1swbzPNr'+
'G+F/Y2TKJgntr6tf1yjpwMH5ufqUwpyHTkMLno40+cT63wvCswlIFCrJZ9VJ15Bh'+
'U2W03fNZPOn0FPDskm2d450fgDWF4t0XwIyxPehqAD6SLBtOKe8fECIn+cpVoYy0'+
'iLLlf5PttcoXgzSUTQIDAQAB', 
            success: (result) => {
                var code_str = this.encodeBase64Content(result.text);
                obj.setData({
                    code_str: code_str
                })
            },
            fail(result) {
                // console.log(result);
            },
        });
    },
    //解密
    onDecrypt: function (obj,str) {

       var decode_str=this.decodeBase64Content(str);

        my.rsa({
            action: 'decrypt',
            text: decode_str,
            //设置私钥
            key: 'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMHVpRdOW28fMzFa'+
'V5HWzBvM82sb4X9jZMomCe2vq1/XKOnAwfm5+pTCnIdOQwuejjT5xPrfC8KzCUgU'+
'Ksln1UnXkGFTZbTd81k86fQU8OySbZ3jnR+ANYXi3RfAjLE96GoAPpIsG04p7x8Q'+
'Iif5ylWhjLSIsuV/k+21yheDNJRNAgMBAAECgYA6nUqBE7bekYa/g9w7Q8MRHRb2'+
'6sVz6jCOWJZkA91E7CF5HksKI009MuR2nhn0J4xFRMpmOpCp3c4Ot9qAcR+z37XV'+
'057GAybyy+uy0gDwA0YgiHRQAHlyXoECnRr5K+6m9Wxmmy09tB3UNaAzzoj4WEMM'+
'iaHpIL51ykucd4We2QJBAO15gGDEEP+g9qwFsEQPJu+dJAx++TY45lihIpxP0Jcn'+
'p71tIPcOf+FVkxt3Ky3eZ1QCZe+paf4PTVJVBg7FzccCQQDQ9KCZfhiDzx4XfHMs'+
'732AbRCh3Fd4CDZXEBnaC3OQWzCGNFAQ9dpUv5JesJndTHB+8d6eozEDz08TYFAQ'+
'gF1LAkEAu3wKk9sXxIozVXqkQAdqaRC6Ljdsz5c6nMySw6/r8fp33wCyXvsOkTt7'+
'idqat3r4PwYprn4lVVSFajQANVeLbwJAAjdF6LrMmcE9iXQ5aHWVuCHv9jd2+f/k'+
'S6IRFB3g+NvutM2jN7rTuOhbLgPjbdRcsQvxl28Vmvu80/DGiJZD5wJBALkjEjhT'+
'ziOZkkbzdlOQGx8lxesxnYsBFC4lopkJ1qdotj8pYpi0Md7UXSL4ZssQRtO0/m+A'+
'4yf+FZJWp+oH0E0=',
            success: (result) => {
                //  console.log(result);
                obj.setData({
                    code_str: result.text,
                })
            },
            fail(result) {
                // console.log(result);
            },
        });
    },
    
    //base64编码
    encodeBase64Content: function(commonContent) {
        let base64Content = Buffer.from(commonContent).toString('base64');
        return base64Content;
    },
    //base64解码
    decodeBase64Content: function(base64Content) {
        let commonContent = base64Content.replace(/\s/g, '+');
        commonContent = Buffer.from(commonContent, 'base64').toString();
        return commonContent;
    },



}