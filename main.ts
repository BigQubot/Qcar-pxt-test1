
let qcarparam = 0
let qcarparam1 = 1
enum PingUnit {
    //% block="cm"
    Centimeters,
}


//% weight=0 color=#00BFFF icon="\uf2c4" block="Qcar"
namespace qcar {
    let kbCallback: KV[] = []

    export enum Patrol {
        //% blockId="patrolLeft" block="left"
        PatrolLeft = 2,
        //% blockId="patrolRight" block="right"
        PatrolRight = 1
    }

    export enum Patrol1 {
        //% blockId="patrolLeft" block="left"
        PatrolLeft = 20,
        //% blockId="patrolRight" block="right"
        PatrolRight = 10
    }


    export enum irstatus {
        //% blockId="iron" block="on"
        iron = 1,
        //% blockId="iroff" block="off"
        iroff = 2
    }

    /**
     * Read ultrasonic sensor.
     */

    //% blockId=ultrasonic_sensor block="read ultrasonic sensor |%unit "
    //% weight=95
    export function Ultrasonic(unit: PingUnit, maxCmDistance = 500): number {
        let d
        pins.digitalWritePin(DigitalPin.P12, 1);
        basic.pause(1)
        pins.digitalWritePin(DigitalPin.P12, 0);
        if (pins.digitalReadPin(DigitalPin.P13) == 0) {
            pins.digitalWritePin(DigitalPin.P12, 0);
            //sleep_us(2);
            pins.digitalWritePin(DigitalPin.P12, 1);
            //sleep_us(10);
            pins.digitalWritePin(DigitalPin.P12, 0);
            d = pins.pulseIn(DigitalPin.P13, PulseValue.High, maxCmDistance * 58);//readPulseIn(1);
        } else {
            pins.digitalWritePin(DigitalPin.P12, 0);
            pins.digitalWritePin(DigitalPin.P12, 1);
            d = pins.pulseIn(DigitalPin.P13, PulseValue.Low, maxCmDistance * 58);//readPulseIn(0);
        }
        let x = d / 39;
        if (x <= 0 || x > 500) {
            return 0;
        }
        switch (unit) {
            case PingUnit.Centimeters: return Math.round(x);
            default: return Math.idiv(d, 2.54);
        }

    }


     /**
     * Read line tracking sensor.
     */

    //% weight=20
    //% blockId=read_Patrol block="read |%patrol line tracking sensor"
    //% patrol.fieldEditor="gridpicker" patrol.fieldOptions.columns=2 
    export function readPatrol(patrol: Patrol): number {
        if (patrol == Patrol.PatrolLeft) {
            return pins.analogReadPin(AnalogPin.P2)
        } else if (patrol == Patrol.PatrolRight) {
            return pins.analogReadPin(AnalogPin.P1)
        } else {
            return -1
        }
    }


    /**
     * Enable IR LED.
     */

    //% blockId=IR_Enable block="Set the infrared status to |%irstatus"
    //% irstatus.fieldEditor="gridpicker" irstatus.fieldOptions.columns=2 
    //% weight=93 blockGap=8

    export function IREnable(IRstatus: irstatus): void {
        if (IRstatus == irstatus.iron) {
            pins.digitalWritePin(DigitalPin.P14, 1)
        } else if (IRstatus == irstatus.iroff) {
            pins.digitalWritePin(DigitalPin.P14, 0)
        } 
    }

     /**
     * Line tracking sensor event function
     */
    //% weight=2
    //% blockId=kb_event block="on|%value line tracking sensor |%angle"
    //% angle.min=0 angle.max=180
    export function ltEvent(value: Patrol1, angle: number): void {
        let state = value + angle;
        serial.writeNumber(state)
   }

   basic.forever(() => {
    if (kbCallback != null) {
        let sta = patorlState();
        if (sta != 0) {
            for (let item of kbCallback) {
                if (item.key == sta) {
                    item.action();
                }
            }
        }
    }
    basic.pause(50);
})
    

}