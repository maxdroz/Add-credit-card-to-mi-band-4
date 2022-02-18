# Add card to mi band 4 NFC

## Setup proxy
1. Install frida on PC
2. Install and run frida-server on Android (requires root)
3. Install `proxy-droid` (and add `127.0.0.1` to ignore adresses)
4. Prepeare frida js file to disable ssl pinning (`ssl-pinning.js`)
5. run `frida -U -l ./ssl-pinning.js --no-pause -f [package name]`

## Watch for checkUserBand request

Url to watch response for:
`POST https://bankcard.nfcpay.ru.intl.mipay.com/mastercard/wallet/sdk/checkUserBand`

This request will be send before "Не удалось загрузить данные" error message appears.

Expected output:
```
{
	"status": "2000",
	"desc": "Ошибка отклика системы MasterCard",
	"requestId": "f14ad763-7e0c-4862-a8ba-43087786953e",
	"spErrors": [{
		"reasonCode": "INVALID_TOKEN_UNIQUE_REFERENCE",
		"description": "Invalid Token Unique Reference"
	}]
}
```
Just replace `"status": "2000"` to `"status": "0000"` (code `0000` is success)

## Usefull commands

### Get top activity

`adb shell dumpsys activity top | grep ACTIVITY`