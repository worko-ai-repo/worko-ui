import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-message-modal",
  templateUrl: "./message-modal.component.html",
  styleUrls: ["./message-modal.component.scss"],
})
export class MessageModalComponent {
  @Input() title: string = "";
  @Input() message: string = "";

  @Output() onCancel = new EventEmitter<void>();
  @Output() onOk = new EventEmitter<void>();
  @Output() onYesBtn = new EventEmitter<void>();
  @Output() onNoBtn = new EventEmitter<void>();
  @Output() onContinue = new EventEmitter<void>();

  cancelBtn() {
    this.onCancel.emit();
  }

  okBtn() {
    this.onOk.emit();
  }

  yesBtn() {
    this.onYesBtn.emit();
  }

  noBtn() {
    this.onNoBtn.emit();
  }

  continueBtn() {
    this.onContinue.emit();
  }


}
