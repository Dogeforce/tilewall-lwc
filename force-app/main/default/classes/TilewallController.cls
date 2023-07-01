@SuppressWarnings('PMD.ExcessiveParameterList')
public with sharing class TilewallController {
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getAggregateData(
        Id recordId,
        String relatedObjectName,
        String groupByFieldName,
        String relationshipFieldName,
        String customWhereClause
    ) {
        String query = getAggregateRecordsQuery(
            recordId,
            relatedObjectName,
            groupByFieldName,
            relationshipFieldName,
            customWhereClause
        );

        return (List<AggregateResult>) Database.query(query);
    }

    @AuraEnabled(cacheable=true)
    public static List<SObject> getRelatedRecords(
        Id parentId,
        String nameField,
        String objectName,
        String relationshipFieldName,
        String dateFieldName,
        Date dateValue,
        String customWhereClause
    ) {
        if (parentId == null) {
            return new List<SObject>();
        }

        String query = getRelatedRecordsListQuery(
            parentId,
            nameField,
            objectName,
            relationshipFieldName,
            dateFieldName,
            dateValue,
            customWhereClause
        );

        return Database.query(query);
    }

    private static String getAggregateRecordsQuery(
        Id recordId,
        String relatedObjectName,
        String groupByFieldName,
        String relationshipFieldName,
        String customWhereClause
    ) {
        String queryString = String.format(
            'SELECT COUNT(Id)amount, {1} param FROM {0} WHERE {2} = :recordId AND {1} >= LAST_N_DAYS:365 ' +
                (String.isNotBlank(customWhereClause) ? ('AND {3}') : '') +
                ' GROUP BY {1}',
            new List<Object>{
                relatedObjectName,
                groupByFieldName,
                relationshipFieldName,
                customWhereClause
            }
        );
        return queryString;
    }

    private static String getRelatedRecordsListQuery(
        Id parentId,
        String nameField,
        String objectName,
        String relationshipFieldName,
        String dateFieldName,
        Date dateValue,
        String customWhereClause
    ) {
        String query = String.format(
            'SELECT Id, {0} FROM {1} WHERE {2} = :parentId AND {3} = {4} ' +
                (String.isNotBlank(customWhereClause) ? ('AND {5}') : '') +
                ' ORDER BY {0} ASC',
            new List<Object>{
                nameField,
                objectName,
                relationshipFieldName,
                dateFieldName,
                String.format(
                    '{0}-{1}-{2}',
                    new List<Object>{
                        dateValue.year(),
                        getFormattedDayOrMonth(dateValue.month()),
                        getFormattedDayOrMonth(dateValue.day())
                    }
                ),
                customWhereClause
            }
        );

        return query;
    }

    private static String getFormattedDayOrMonth(Integer value) {
        return value < 10 ? ('0' + value) : String.valueOf(value);
    }
}
