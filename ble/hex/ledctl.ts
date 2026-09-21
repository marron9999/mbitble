/**
* このファイルを使って、独自の関数やブロックを定義してください。
* 詳しくはこちらを参照してください：https://makecode.microbit.org/blocks/custom
*/

/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon=""
namespace LEDCTL {
    let strip = neopixel.create(DigitalPin.P0, 1, NeoPixelMode.RGB)
    let RGB: number[] = []
    /**
     * TODO: describe your function here
     * @param M describe parameter here
     */
    //% block
    export function 初期化(M: number) {
        RGB = [
            0x0000, 0x0008, 0x000F, 0x0080,
            0x0088, 0x00F0, 0x00FF, 0x0800,
            0x0808, 0x0880, 0x0888, 0x0CCC,
            0x0F00, 0x0F0F, 0x0FF0, 0x0FFF
        ]
        MaxLED = M
        strip = neopixel.create(DigitalPin.P0, M, NeoPixelMode.RGB)
        strip.showColor(neopixel.colors(NeoPixelColors.Black))
    }

    let 動的: number = 0
    let 種別: number = 0
    let 間1: number = 0
    let 間0: number = 0
    let 青: number = 0
    let 緑: number = 0
    let 赤: number = 0
    let MaxLED: number = -1

    let 配_値: number[] = []
    let 配_間1: number[] = []
    let 配_間0: number[] = []
    let 配_時刻: number[] = []
    let 配_種別: number[] = []
    let 配_青: number[] = []
    let 配_緑: number[] = []
    let 配_赤: number[] = []
    let 次_青: number[] = []
    let 次_緑: number[] = []
    let 次_赤: number[] = []

    /**
     * TODO: describe your function here
     * @param V describe parameter here
     */
    //% block
    export function 制御5(V:number): void {
        動的 = 0
        if (V == 0) {
            設定_種別(0)
            strip.showColor(neopixel.colors(NeoPixelColors.Black))
        } else if (V == 1) {
            設定_種別(0)
            設定_色()
        } else if (V == 2) {
            種別 = 1
            設定_種別(1)
            設定_色()
        } else if (V == 3) {
            種別 = 2
            設定_種別(2)
            設定_色()
        } else if (V == 4) {
            種別 = 3
            設定_種別(3)
            設定_色()
        } else if (V == 5) {
            種別 = 4
            設定_種別(4)
            設定_色()
        } else if (V == 15) {
            動的 = 1
        }
    }
    /**
     * TODO: describe your function here
     * @param IX describe parameter here
     */
    //% block
    export function 制御4(IX: number): void {
        let _RGB = RGB[IX]
        赤 = Math.idiv(_RGB, 256)
        緑 = Math.idiv(_RGB, 16) % 16
        青 = _RGB % 16
        赤 = 赤 * 16 + 赤
        緑 = 緑 * 16 + 緑
        青 = 青 * 16 + 青
    }
    /**
     * TODO: describe your function here
     * @param V describe parameter here
     */
    //% block
    export function 制御1(V: number): void {
        赤 = V * 16 + V
    }
    /**
     * TODO: describe your function here
     * @param V describe parameter here
     */
    //% block
    export function 制御2(V: number): void {
        緑 = V * 16 + V
    }
    /**
     * TODO: describe your function here
     * @param V describe parameter here
     */
    //% block
    export function 制御3(V: number): void {
        青 = V * 16 + V
    }
    /**
     * TODO: describe your function here
     * @param V describe parameter here
     */
    //% block
    export function 制御6(V: number): void {
        間0 = (V + 1) * 100
    }
    /**
     * TODO: describe your function here
     * @param V describe parameter here
     */
    //% block
    export function 制御7(V: number): void {
        間1 = (V + 1) * 100
    }
    /**
     * TODO: describe your function here
     * @param N describe parameter here
     */
    //% block
    export function 制御14(N: number): void {
        let _V = N % 32
        変更次色(_V)
    }
    /**
     * TODO: describe your function here
     * @param N describe parameter here
     */
    //% block
    export function 制御12(N: number): void {
        let _V = N % 32
        変更種別(_V)
    }
    /**
     * TODO: describe your function here
     * @param N describe parameter here
     */
    //% block
    export function 制御10(N: number): void {
        let _V = N % 32
        変更色(_V)
    }
    /**
     * TODO: describe your function here
     * @param N describe parameter here
     */
    //% block
    export function 制御8(N: number): void {
        let _V = N % 32
        設定数(_V + 1)
    }

    function 変化色X(IX: number, Value: number) {
        let _V = 2 ** Value
        let _R = Math.idiv(配_赤[IX], _V)
        let _G = Math.idiv(配_緑[IX], _V)
        let _B = Math.idiv(配_青[IX], _V)
        if (_R == 0 && _G == 0 && _B == 0 ) {
            配_赤[IX] = 次_赤[IX]
            配_緑[IX] = 次_緑[IX]
            配_青[IX] = 次_青[IX]
        }
        strip.setPixelColor(IX, neopixel.rgb(_R, _G, _B))
    }
    function 変化色1(IX: number, T1: number, T0: number, _V: number) {
        let _T = control.millis();
        if (_V == 0) {
            _V = 1
            変化色X(IX, 0)
            if (T1 == 0) {
                _T += 500
            } else {
                _T += T1
            }
        } else {
            _V = 0
            strip.setPixelColor(IX, neopixel.colors(NeoPixelColors.Black))
            配_赤[IX] = 次_赤[IX]
            配_緑[IX] = 次_緑[IX]
            配_青[IX] = 次_青[IX]
            if (T0 == 0) {
                _T += 500
            } else {
                _T += T0
            }
        }
        strip.show()
        配_時刻[IX] = _T
        配_値[IX] = _V
    }
    function 変化色2(IX: number, T1: number, _V: number) {
        変化色X(IX, 8 - _V)
        strip.show()
        let _T = control.millis()
        if (T1 == 0) {
            _T += 200
        } else {
            _T += T1
        }
        _V += 1
        if (_V >= 8) {
            _V = 0
        }
        配_時刻[IX] = _T
        配_値[IX] = _V
    }
    function 変化色3(IX: number, T1: number, _V: number) {
        変化色X(IX, _V)
        strip.show()
        let _T = control.millis()
        if (T1 == 0) {
            _T += 200
        } else {
            _T += T1
        }
        _V += 1
        if (_V >= 8) {
            _V = 0
        }
        配_時刻[IX] = _T
        配_値[IX] = _V
    }
    function 変化色4(IX: number, T1: number, _V: number) {
        if (_V < 8) {
            変化色X(IX, 8 - _V)
        } else {
            変化色X(IX, _V - 8)
        }
        strip.show()
        let _T = control.millis()
        if (T1 == 0) {
            _T += 200
        } else {
            _T += T1
        }
        _V += 1
        if (_V >= 16) {
            _V = 0
        }
        配_時刻[IX] = _T
        配_値[IX] = _V
    }
    function 変更種別(IX: number) {
        if (IX < MaxLED) {
            配_種別[IX] = 種別
            配_間0[IX] = 間0
            配_間1[IX] = 間1
            配_値[IX] = 0
            配_時刻[IX] = 0
        }
    }
    function 変更次色(IX: number) {
        if (IX < MaxLED) {
            次_赤[IX] = 赤
            次_緑[IX] = 緑
            次_青[IX] = 青
        }
    }
    /**
     * TODO: describe your function here
     * @param NO describe parameter here
     */
    //% block
    export function 設定_種別(NO: number) {
        種別 = NO
        for (let I = 0; I < MaxLED; I++) {
            変更種別(I)
        }
    }
    /**
     * TODO: describe your function here
     */
    //% block
    export function 設定_色() {
        for (let I = 0; I < MaxLED; I++) {
            if(種別 == 0) {
                配_赤[I] = 次_赤[I]
                配_緑[I] = 次_緑[I]
                配_青[I] = 次_青[I]
            }
            let _R = 配_赤[I]
            let _G = 配_緑[I]
            let _B = 配_青[I]
            strip.setPixelColor(I, neopixel.rgb(_R, _G, _B))
        }
        strip.show()
    }
    function 変更色(IX: number) {
        if (IX < MaxLED) {
            配_赤[IX] = 赤
            配_緑[IX] = 緑
            配_青[IX] = 青
            次_赤[IX] = 赤
            次_緑[IX] = 緑
            次_青[IX] = 青
            strip.setPixelColor(IX, neopixel.rgb(赤, 緑, 青))
        }
        strip.show()
    }
    /**
     * TODO: describe your function here
     */
    //% block
    export function 変化() {
        if (動的 > 0) {
            for (let I = 0; I < MaxLED; I++) {
                let _A = 配_種別[I]
                let _T = 配_時刻[I]
                let _0 = 配_間0[I]
                let _1 = 配_間1[I]
                let _V = 配_値[I]
                let _C = control.millis()
                if (_A == 1) {
                    if (_T <= _C) {
                        変化色1(I, _1, _0, _V)
                    }
                } else if (_A == 2) {
                    if (_T <= _C) {
                        変化色2(I, _1, _V)
                    }
                } else if (_A == 3) {
                    if (_T <= _C) {
                        変化色3(I, _1, _V)
                    }
                } else if (_A == 4) {
                    if (_T <= _C) {
                        変化色4(I, _1, _V)
                    }
                }
            }
        }
    }
    function 設定数(数: number) {
        if (数 == MaxLED) {
            間0 = 0
            間1 = 0
            設定_種別(0)
            設定_色()
        } else {
            間0 = 0
            間1 = 0
            種別 = 0
            赤 = 0
            緑 = 0
            青 = 0
            MaxLED = 数
            for (let I = 0; I < 数; I++) {
                配_赤[I] = 0
                配_緑[I] = 0
                配_青[I] = 0
                次_赤[I] = 0
                次_緑[I] = 0
                次_青[I] = 0
                配_種別[I] = 0
                配_時刻[I] = 0
                配_間0[I] = 0
                配_間1[I] = 0
                配_値[I] = 0
            }
            strip = neopixel.create(DigitalPin.P0, 数, NeoPixelMode.RGB)
            strip.showColor(neopixel.colors(NeoPixelColors.Black))
        }
    }
}
