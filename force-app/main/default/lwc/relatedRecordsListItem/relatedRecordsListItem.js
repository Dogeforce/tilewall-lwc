import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class RelatedRecordsListItem extends NavigationMixin(
  LightningElement
) {
  @api record;
  @api nameField;
  @api iconName;

  recordUrl;

  get name() {
    if (!this.record || !this.nameField) {
      return "";
    }
    return this.record[this.nameField];
  }

  // When the user clicks on the record's name, it will navigate to the record's detail page
  handleClick() {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: this.record.Id,
        actionName: "view"
      }
    });
  }
}
