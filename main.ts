function SetStrToList (Dat: string) {
    Ulist = []
    for (let I = 0; I <= Dat.length - 1; I++) {
        Ulist.push(Dat.charAt(I))
    }
    return Ulist
}
function SumDigitInLdata (Ldat: any[], RemDigit: number) {
    Lodd = OddEvenAndSliceAtIdx(Ldat, true)
    Leven = OddEvenAndSliceAtIdx(Ldat, false)
    Nodd = SumTheList(Lodd)
    Neven = SumTheList(Leven)
    NsVal = Neven * 3
    NsVal += Nodd
    Nsum = (RemDigit - NsVal % RemDigit) % RemDigit
    return Nsum
}
function WriteAsciiLineSelector () {
    Str = ""
    for (let index = 0; index <= EanInput.length - 1; index++) {
        C = "-"
        if (index == IdxInput) {
            C = "="
        }
        Str = "" + Str + C
    }
    return Str
}
spriteutils.createRenderable(0, function (screen2) {
    if (SetupDone) {
        spriteutils.drawTransparentImage(DrawEanImage(60, 8, 1, scene.backgroundColor()), screen2, 0, 0)
        if (WritingBarcode) {
            images.print(screen2, EanInput, Ix, Iy, 1)
            images.print(screen2, WriteAsciiLineSelector(), Ix, Iy + 8, 1)
            images.print(screen2, WriteAsciiLineSelector(), Ix, Iy - 8, 1)
        }
    }
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (WritingBarcode) {
        WriteInput(false, 0, 9)
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (WritingBarcode) {
        if (WriteNumberStrToEan(EanInput)) {
            SetEanEncode(LeanStr)
        }
        WritingBarcode = false
    } else {
        if (WriteNumberStrToEan(convertToText(randint(1, 999999999999)))) {
            SetEanEncode(LeanStr)
        }
    }
})
function WriteNumberStrToEan (EanStr: string) {
    if (CheckStrIsAllOfNumber(EanStr)) {
        if (EanStr.length > 12) {
            return false
        }
        DatStr = EanStr
        if (Math.abs(12 - DatStr.length) > 0) {
            while (Math.abs(12 - DatStr.length) > 0) {
                DatStr = "" + DatStr + "0"
            }
        }
        LeanStr = SetStrToList(DatStr)
        Dsum = convertToText(SumDigitInLdata(LeanStr, 10))
        DatStr = "" + DatStr + Dsum
        LeanStr = SetStrToList(DatStr)
        return true
    }
    return false
}
function SumTheList (StrLdat: string[]) {
    N = 0
    for (let value of StrLdat) {
        N += parseFloat(value)
    }
    return N
}
function OddEvenAndSliceAtIdx (Ldat: string[], Odd: boolean) {
    Ulist = []
    J = 0
    for (let value of Ldat) {
        J += 1
        if (Odd) {
            if (J % 2 == 1) {
                Ulist.push(value)
            }
        } else {
            if (J % 2 == 0) {
                Ulist.push(value)
            }
        }
    }
    return Ulist
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (WritingBarcode) {
        WriteInput(true, 0, 9)
    }
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (WritingBarcode) {
        IdxInput = Math.max(IdxInput - 1, 0)
    }
})
function Setup () {
    SetUpEanBarcode()
    SetupEan13Template()
}
function SetEanEncode (Ldat: string[]) {
    EanPattenDat = []
    for (let value of TempEanPatten) {
        EanPattenDat.push(value)
    }
    J = 0
    I = 0
    for (let value of TempEanPatten) {
        if (value.includes("-------")) {
            EanIdx = PalLeftEncode[0].indexOf(LeanStr[I])
        } else {
            if (I - 1 < 6) {
                EstrIdx = PalLeftEncode[1][EanIdx]
                ENidx = PalName.indexOf(EstrIdx.charAt(I - 1))
            } else {
                ENidx = 2
            }
            if (EanPattenDat[J].includes("0000000")) {
                if (I - 1 < 6) {
                    EanPattenDat[J] = PalPatten[ENidx][parseFloat(Ldat[I])]
                } else {
                    EanPattenDat[J] = PalPatten[2][parseFloat(Ldat[I])]
                }
            }
        }
        if (value.length > 5) {
            I += 1
        }
        J += 1
    }
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (WritingBarcode) {
        IdxInput = Math.min(IdxInput + 1, EanInput.length - 1)
    }
})
function DrawEanImage (Hight: number, EdgeWidth: number, Wcol: number, Bcol: number) {
    EanImage = image.create(SumTheNumList(TempEanWidth), Hight)
    EanImage.fill(Wcol)
    I = 0
    Si = 0
    ImgWidthIdx = 0
    for (let value of EanPattenDat) {
        if (value.includes("-------")) {
            images.print(EanImage, LeanStr[Si], ImgWidthIdx + 1, Hight - 8, Bcol)
        } else {
            if (value.length > 5) {
                for (let J = 0; J <= EanPattenDat[I].length - 1; J++) {
                    if (parseFloat(EanPattenDat[I].charAt(J)) > 0) {
                        EanImage.fillRect(ImgWidthIdx + J, 0, 1, Hight - 8, Bcol)
                    }
                }
                images.print(EanImage, LeanStr[Si], ImgWidthIdx + 1, Hight - 8, Bcol)
            } else {
                for (let J = 0; J <= EanPattenDat[I].length - 1; J++) {
                    if (parseFloat(EanPattenDat[I].charAt(J)) > 0) {
                        EanImage.fillRect(ImgWidthIdx + J, 0, 1, Hight, Bcol)
                    }
                }
            }
        }
        if (value.length > 5) {
            Si += 1
        }
        ImgWidthIdx += TempEanWidth[I]
        I += 1
    }
    EanBGimage = image.create(EdgeWidth * 2 + SumTheNumList(TempEanWidth), EdgeWidth * 2 + Hight)
    EanBGimage.fill(Wcol)
    spriteutils.drawTransparentImage(EanImage.clone(), EanBGimage, EdgeWidth, EdgeWidth)
    return EanBGimage
}
function OddEvenAndSlice (Ldat: string[], Odd: boolean) {
    Ulist = []
    for (let value of Ldat) {
        if (Odd) {
            if (parseFloat(value) % 2 == 1) {
                Ulist.push(value)
            }
        } else {
            if (parseFloat(value) % 2 == 0) {
                Ulist.push(value)
            }
        }
    }
    return Ulist
}
function CheckStrIsAllOfNumber (Str: string) {
    for (let J = 0; J <= Str.length - 1; J++) {
        if (!("0123456789".includes(Str.charAt(J)))) {
            return false
        }
    }
    return true
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    WritingBarcode = !(WritingBarcode)
    EanInput = ""
    for (let index = 0; index <= DatStr.length - 2; index++) {
        EanInput = "" + EanInput + DatStr.charAt(index)
    }
    IdxInput = 0
})
function SetupEan13Template () {
    TempEanWidth = [
    7,
    3,
    7,
    7,
    7,
    7,
    7,
    7,
    5,
    7,
    7,
    7,
    7,
    7,
    7,
    3
    ]
    TempEanPatten = [
    "-------",
    "101",
    "0000000",
    "0000000",
    "0000000",
    "0000000",
    "0000000",
    "0000000",
    "01010",
    "0000000",
    "0000000",
    "0000000",
    "0000000",
    "0000000",
    "0000000",
    "101"
    ]
}
function SumTheNumList (NumLdat: any[]) {
    N = 0
    for (let value of NumLdat) {
        N += value
    }
    return N
}
function SetUpEanBarcode () {
    PalName = ["l", "g", "r"]
    PalPatten = [[
    "0001101",
    "0011001",
    "0010011",
    "0111101",
    "0100011",
    "0110001",
    "0101111",
    "0111011",
    "0110111",
    "0001011"
    ], [
    "0100111",
    "0110011",
    "0010011",
    "0100001",
    "0011101",
    "0111001",
    "0000101",
    "0010001",
    "0001001",
    "0010111"
    ], [
    "1110010",
    "1100110",
    "1101100",
    "1000010",
    "1011100",
    "1001110",
    "1010000",
    "1000100",
    "1001000",
    "1110100"
    ]]
    PalLeftEncode = [[
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9"
    ], [
    "llllll",
    "llglgg",
    "llgglg",
    "llgggl",
    "lgllgg",
    "lggllg",
    "lgggll",
    "lglglg",
    "lglggl",
    "lgglgl"
    ]]
}
function WriteInput (SumUp: boolean, Min: number, Max: number) {
    Str = ""
    for (let index = 0; index <= EanInput.length - 1; index++) {
        N = parseFloat(EanInput.charAt(index))
        if (index == IdxInput) {
            if (SumUp) {
                N = Math.min(N + 1, Max)
            } else {
                N = Math.max(N - 1, Min)
            }
        }
        Str = "" + Str + convertToText(N)
    }
    EanInput = Str
}
let EanBGimage: Image = null
let ImgWidthIdx = 0
let Si = 0
let TempEanWidth: number[] = []
let EanImage: Image = null
let PalPatten: string[][] = []
let PalName: string[] = []
let ENidx = 0
let EstrIdx = ""
let PalLeftEncode: string[][] = []
let EanIdx = 0
let I = 0
let TempEanPatten: string[] = []
let EanPattenDat: string[] = []
let J = 0
let N = 0
let Dsum = ""
let DatStr = ""
let IdxInput = 0
let C = ""
let EanInput = ""
let Str = ""
let Nsum = 0
let NsVal = 0
let Neven = 0
let Nodd = 0
let Leven: string[] = []
let Lodd: string[] = []
let Ulist: string[] = []
let LeanStr: string[] = []
let Iy = 0
let Ix = 0
let SetupDone = false
let WritingBarcode = false
Setup()
WritingBarcode = false
SetupDone = true
Ix = 0
Iy = scene.screenHeight() - 30
scene.setBackgroundColor(15)
if (WriteNumberStrToEan(convertToText(randint(1, 999999999999)))) {
    SetEanEncode(LeanStr)
}
