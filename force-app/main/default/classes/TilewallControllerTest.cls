@IsTest
private class TilewallControllerTest {
    @IsTest
    static void testGetAggregateData() {
        List<AggregateResult> result = TilewallController.getAggregateData(
            UserInfo.getUserId(),
            'Opportunity',
            'CloseDate',
            'OwnerId',
            'Name != NULL'
        );

        System.assertNotEquals(null, result, 'The result should be a list.');
        System.assertEquals(
            0,
            result.size(),
            'The result should be an empty list.'
        );
    }

    @IsTest
    static void testGetRelatedRecords() {
        List<Opportunity> result = TilewallController.getRelatedRecords(
            UserInfo.getUserId(), // pass an unrelated id to ensure we bypass the parentId null check in the call
            'Name',
            'Opportunity',
            'AccountId',
            'CloseDate',
            Date.today(),
            'Name != NULL'
        );

        System.assertNotEquals(null, result, 'The result should be a list.');
        System.assertEquals(
            0,
            result.size(),
            'The result should be an empty list.'
        );
    }
}
