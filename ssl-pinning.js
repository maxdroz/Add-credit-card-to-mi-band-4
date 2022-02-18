/* 
   Android SSL Re-pinning frida script v0.2 030417-pier
$ adb push burpca-cert-der.crt /data/local/tmp/cert-der.crt
   $ frida -U -f it.app.mobile -l frida-android-repinning.js --no-pause
https://techblog.mediaservice.net/2017/07/universal-android-ssl-pinning-bypass-with-frida/
   
   UPDATE 20191605: Fixed undeclared var. Thanks to @oleavr and @ehsanpc9999 !
*/

setTimeout(function() {
    Java.perform(function() {
        try {
            console.log("CertificatePinner");
            var CertificatePinner = Java.use("okhttp3.CertificatePinner");
            CertificatePinner.check.overload("java.lang.String", "java.util.List").implementation = function() {
                console.log("CertificatePinner MOKKKKKKEDDDD");
            };
        } catch (err) {
            console.log("CertificatePinner not found");
        }
    })

}, 0)

setTimeout(function() {
    Java.perform(function() {
        try {
            console.log("PinningTrustManager");
            const PinningTrustManager = Java.use("appcelerator.https.PinningTrustManager");
            PinningTrustManager.checkServerTrusted.implementation = function() {
                console.log("PinningTrustManager MOKKKKKKEDDDD");
            }
        } catch (err) {
            console.log("PinningTrustManager not found");
        }
    })

}, 0)

setTimeout(function() {
    Java.perform(function() {
        try {
            console.log("TrustManagerImpl");
            const TrustManagerImpl = Java.use("com.android.org.conscrypt.TrustManagerImpl");
            TrustManagerImpl.verifyChain.implementation = function(untrustedChain, trustAnchorChain,
                host, clientAuth, ocspData, tlsSctData) {
                console.log("TrustManagerImpl MOKKKKKKEDDDD");
                return untrustedChain
            }
        } catch (err) {
            console.log("TrustManagerImpl not found");
        }
    })

}, 0)

setTimeout(function() {
    Java.perform(function() {
        try {
            console.log("TrustManagerImpl.checkTrustedRecursive");
            const ArrayList = Java.use("java.util.ArrayList");
            const TrustManagerImpl = Java.use("com.android.org.conscrypt.TrustManagerImpl");
            TrustManagerImpl.checkTrustedRecursive.implementation = function(certs, host, clientAuth, untrustedChain,
                trustAnchorChain, used) {
                console.log("TrustManagerImpl.checkTrustedRecursive MOKKKKKKEDDDD");
                return ArrayList.$new()
            }
        } catch (err) {
            console.log("TrustManagerImpl.checkTrustedRecursive not found");
        }
    })

}, 0)

setTimeout(function() {
    Java.perform(function() {
        try {
            console.log("SSLCertificateChecker");
            const SSLCertificateChecker = Java.use("nl.xservices.plugins.SSLCertificateChecker");
            SSLCertificateChecker.execute.overload("java.lang.String", "org.json.JSONArray", "org.apache.cordova.CallbackContext").implementation = function(str, jsonArray, callBackContext) {
                console.log("SSLCertificateChecker MOKKKKKKEDDDD");
                callBackContext.success("CONNECTION_SECURE");
                return true;
            }
        } catch (err) {
            console.log("SSLCertificateChecker not found");
        }
    })

}, 0)

setTimeout(function() {
    Java.perform(function() {
            console.log("");
            console.log("[.] Cert Pinning Bypass/Re-Pinning");
            var Str = Java.use("java.lang.String")
            var CertificateFactory = Java.use("java.security.cert.CertificateFactory");
            var FileInputStream = Java.use("java.io.FileInputStream");
            var BufferedInputStream = Java.use("java.io.BufferedInputStream");
            var X509Certificate = Java.use("java.security.cert.X509Certificate");
            var KeyStore = Java.use("java.security.KeyStore");
            var TrustManagerFactory = Java.use("javax.net.ssl.TrustManagerFactory");
            var SSLContext = Java.use("javax.net.ssl.SSLContext");
            // var TrustedSslSocketFactory = Java.use("com.car2go.cow.config.TrustedSslSocketFactory")
                // Load CAs from an InputStream
            console.log("[+] Loading our CA...")
            var cf = CertificateFactory.getInstance("X.509");

            try {
                var fileInputStream = FileInputStream.$new("/data/local/tmp/crt2.crt");
            } catch (err) {
                console.log("[o] " + err);
            }

            var bufferedInputStream = BufferedInputStream.$new(fileInputStream);
            var ca = cf.generateCertificate(bufferedInputStream);
            bufferedInputStream.close();
            var certInfo = Java.cast(ca, X509Certificate);
            console.log("[o] Our CA Info: " + certInfo.getSubjectDN());
            // Create a KeyStore containing our trusted CAs
            console.log("[+] Creating a KeyStore for our CA...");
            var keyStoreType = KeyStore.getDefaultType();
            var keyStore = KeyStore.getInstance(keyStoreType);
            keyStore.load(null, null);
            keyStore.setCertificateEntry("ca", ca);

            // Create a TrustManager that trusts the CAs in our KeyStore
            console.log("[+] Creating a TrustManager that trusts the CA in our KeyStore...");
            var tmfAlgorithm = TrustManagerFactory.getDefaultAlgorithm();
            var tmf = TrustManagerFactory.getInstance(tmfAlgorithm);
            // var pass = Str.$new("password")
            // var passArr = pass.toCharArray()
            // tmf.init(keyStore, passArr);
            tmf.init(keyStore);
            console.log("[+] Our TrustManager is ready...");
            console.log("[+] Hijacking SSLContext methods now...")
            console.log("[-] Waiting for the app to invoke SSLContext.init()...")
            SSLContext.init.overload("[Ljavax.net.ssl.KeyManager;", "[Ljavax.net.ssl.TrustManager;", "java.security.SecureRandom").implementation = function(a, b, c) {
                console.log("[o] App invoked javax.net.ssl.SSLContext.init...");
                SSLContext.init.overload("[Ljavax.net.ssl.KeyManager;", "[Ljavax.net.ssl.TrustManager;", "java.security.SecureRandom").call(this, a, tmf.getTrustManagers(), c);
                console.log("[+] SSLContext initialized with our custom TrustManager!");
            }


        })
    // Java.perform(function() {
    //     console.log("root seted")
    //     var SDK = Java.use("com.jumio.MobileSDK")
    //     SDK.isRooted.implementation = function(a) {
    //         console.log("looking for root")
    //         return false
    //     }

    // });
}, 0);