import { wire, api, LightningElement } from "lwc";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import getRelatedRecords from "@salesforce/apex/TilewallController.getRelatedRecords";

export default class RelatedRecordsList extends LightningElement {
  @api objectName;
  @api parentId;
  @api relationshipField;
  @api date;
  @api dateFieldName;

  iconName;
  nameField;
  records = [];
  relatedObjectNamePlural = "";
  _objectName;

  get hasData() {
    return this.records && this.records.length > 0;
  }

  @wire(getObjectInfo, { objectApiName: "$_objectName" })
  wiredRelatedObjectInfo({ error, data }) {
    if (error || !this._objectName) {
      return;
    }
    if (data) {
      // gets the name field
      this.nameField = data.nameFields[0];

      // gets the plural label for the object
      this.relatedObjectNamePlural = data.labelPlural;

      // gets the object's icon
      const themeInfo = data.themeInfo;
      const fullIconUrl = themeInfo.iconUrl.split("/");
      const category = fullIconUrl[fullIconUrl.length - 2];
      const iconName = fullIconUrl[fullIconUrl.length - 1].split("_")[0];

      this.iconName = `${category}:${iconName}`;
    }
  }

  @wire(getRelatedRecords, {
    parentId: "$parentId",
    nameField: "$nameField",
    objectName: "$objectName",
    relationshipFieldName: "$relationshipField",
    dateFieldName: "$dateFieldName",
    dateValue: "$date"
  })
  wiredRelatedRecords({ error, data }) {
    if (error) {
      console.error(
        "Something went wrong fetching data from the wire service."
      );
      return;
    }
    if (data) {
      this.records = data;
    }
  }

  connectedCallback() {
    this._objectName = { objectApiName: this.objectName };
  }
}
