import { wire, api, LightningElement } from "lwc";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import getRelatedRecords from "@salesforce/apex/TilewallController.getRelatedRecords";

export default class RelatedRecordsList extends LightningElement {
  @api objectName;
  @api parentId;
  @api relationshipField;
  @api date;
  @api dateFieldName;
  @api customWhereClause = "";
  @api hideConfigErrorMessages;

  errors = [];
  iconName;
  nameField;
  records = [];
  relatedObjectNamePlural = "";
  _objectName;

  get hasErrors() {
    return this.errors.length > 0;
  }

  get hasData() {
    return this.records && this.records.length > 0;
  }

  @wire(getObjectInfo, { objectApiName: "$_objectName" })
  wiredRelatedObjectInfo({ error, data }) {
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
    if (error || !this._objectName) {
      // will display "Object Task is not supported in UI API" if the object is not supported
      if (
        error?.body?.statusCode === 400 &&
        error?.body?.errorCode === "INVALID_TYPE"
      ) {
        console.warn(error.body.message);
        this.errors = [error.body.message];
      } else if (error) {
        console.error(error);
      }
    }
  }

  @wire(getRelatedRecords, {
    parentId: "$parentId",
    nameField: "$nameField",
    objectName: "$objectName",
    relationshipFieldName: "$relationshipField",
    dateFieldName: "$dateFieldName",
    dateValue: "$date",
    customWhereClause: "$customWhereClause"
  })
  // eslint-disable-next-line no-unused-vars
  wiredRelatedRecords({ error, data }) {
    if (data) {
      this.records = data;
    }
  }

  connectedCallback() {
    this._objectName = { objectApiName: this.objectName };
  }
}
