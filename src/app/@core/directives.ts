import { AfterContentInit, Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ToastOptions } from '@ionic/core';

import {
    AnimationBuilder,
    animate,
    style,
    keyframes
} from '@angular/animations';

@Directive({ selector: '[divider]' })
export class DividerDirective implements AfterContentInit {
    constructor(private el: ElementRef) { }

    ngAfterContentInit() {
        this.el.nativeElement.style.margin = '32px auto';
    }
}

type Action = 'cut' | 'copy' | 'paste' | 'click' | 'mouseover' | 'contextmenu' | 'dblclick' | 'focus' | 'blur';


@Directive({ selector: '[bigBrother]' })
export class BigBrotherDirective implements AfterContentInit, OnDestroy {

    @Input('bigBrother') action: Action = 'click';
    @Input() element?: string;
    @Input() secret = false;
    @Input() animation = false;
    private disposeListener: Function;
    private toastConfig: ToastOptions = {
        color: 'danger',
        header: 'BIG BROTHER',
        position: 'top',
        duration: 5000,
        buttons: [
            {
                side: 'end',
                icon: 'eye',
                handler: () => false
            }
        ]
    };
    player = this.builder.build([
        style({ outline: 'none', transform: 'scale(1)' }),
        animate('500ms ease-in', keyframes([
            style({ outline: '1px solid red', transform: 'scale(1.1)' }),
            style({ transform: 'scale(1)' }),
            style({ transform: 'scale(1.1)' }),
            style({ transform: 'scale(1)' }),
            style({ transform: 'scale(1.1)' }),
            style({ transform: 'scale(1)' }),
            style({ transform: 'scale(1.1)' }),
            style({ outline: 'none', transform: 'scale(1)' }),
        ]))
    ]).create(this.el.nativeElement);

    constructor(
        private renderer: Renderer2,
        private el: ElementRef,
        private toast: ToastController,
        private builder: AnimationBuilder
        ) { }

    ngAfterContentInit() {

        if (!this.secret) {
            const position = (this.el.nativeElement as Element).hasChildNodes() ? 'beforeend' : 'afterend';
            (this.el.nativeElement as Element).insertAdjacentHTML(position, `<ion-icon name="eye" style="font-size: 0.7em"></ion-icon>`);
        }

        this.disposeListener = this.renderer.listen(this.el.nativeElement, this.action, (e: Event) => {

            if(this.animation) this.player.play();

            let message: string;
            let color = this.toastConfig.color;
            let duration = this.toastConfig.duration;

            switch (this.action) {
                case 'copy': case 'cut': message = 'The content on this website is protected under the Law of blah blah blah. Using anything from this site without permission is therefore completely not illegal. Big Brother is always watching.';
                    break;
                case 'paste': e.preventDefault(); message = 'Pasting to this field is not allowed. It is 1984, after all.';
                    break;
                case 'mouseover': message = 'Big Brother is <strong>always</strong> watching.'; color = 'dark'; duration = 1000;
                    break;
                case 'contextmenu': e.preventDefault(); message = 'Big Brother has disabled usage of the Context Menu.';
                    break;
                case 'dblclick': message = `Copying text from this website is unprotected under the law of Everything Isn't Not Unfree.`;
                    break;
                case 'focus':
                    if (this.element == 'input') {
                        message = 'The text you submit here will be displayed on your public profile exactly as you enter it. Hence it is a good idea to user proper casing, punctuation, and spelling.';
                    }
                    color = 'primary';
                    break;
                case 'blur':
                    if (this.element == 'input') {
                        message = 'Do double check your text - we are in the age of the internet: everything is permanent.';
                    }
                    color = 'warning';
                    break;
            }

            this.toast.getTop().then(t => {
                if(t) t.dismiss();
                this.toast.create({
                    ...this.toastConfig,
                    message,
                    color,
                    duration
                }).then(t => t.present());
            })
            
        });
    }

    ngOnDestroy() {
        this.disposeListener();
    }

}