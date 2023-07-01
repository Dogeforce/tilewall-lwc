import { LightningElement, api } from 'lwc';

export default class RelatedRecordsListItem extends LightningElement {
  @api record;
  @api nameField;

  get name() {
    if (!this.record || !this.nameField) {
      return '';
    }
    return this.record[this.nameField];
  }
}