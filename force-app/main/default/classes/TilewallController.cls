@SuppressWarnings('PMD.ExcessiveParameterList')
public with sharing class TilewallController {

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getAggregateData(Id recordId, String relatedObjectName, String groupByFieldName, String relationshipFieldName, String customWhereClause) {
        String query = getQuery(recordId, relatedObjectName, groupByFieldName, relationshipFieldName, customWhereClause);
        return (List<AggregateResult>) Database.query(query);
    }

    private static String getQuery(Id recordId, String relatedObjectName, String groupByFieldName, String relationshipFieldName, String customWhereClause) {
        String queryString = String.format('SELECT COUNT(Id)amount, {1} param FROM {0} WHERE {2} = :recordId AND {1} >= LAST_N_DAYS:365 ' + (String.isNotBlank(customWhereClause) ? ('AND {3}') : '') + ' GROUP BY {1}', new List<Object>{
            relatedObjectName, groupByFieldName, relationshipFieldName, customWhereClause
        });
        return queryString;
    }
}
