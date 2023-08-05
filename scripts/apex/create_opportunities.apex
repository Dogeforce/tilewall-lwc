Account parent = new Account(Name='Acme, Inc.');
insert parent;

List<Opportunity> opportunities = new List<Opportunity>();

for (Integer i = 0; i < 100; i++) {
    Opportunity o = new Opportunity(
        AccountId = parent.Id,
        Name = 'Opportunity ' + i,
        CloseDate = Date.today().addDays(Integer.valueOf(Math.random() * -30)),
        StageName = 'Open'
    );
    opportunities.add(o);
}

insert opportunities;
