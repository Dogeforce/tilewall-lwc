@IsTest
private class TilewallControllerTest {

    @IsTest
    static void testSoql() {
        List<AggregateResult> result = TilewallController.getAggregateData(UserInfo.getUserId(), 'Opportunity', 'CloseDate', 'OwnerId');

        System.assertNotEquals(null, result, 'The result should be an empty list.');
    }
}
