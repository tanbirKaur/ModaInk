angular.module('portal-modaink').controller('PayoutsController', function($scope,$rootScope,httpService,storageService) {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    if (month < 10) { month = '0' + month; }
    if (day < 10) { day = '0' + day; }
    var payoutRange = {};
    payoutRange.to = year+'-01-01';
    payoutRange.from = year+'-'+month+'-'+day;
    $scope.isAdmin = storageService.get("isAdmin");
    $scope.monthNames = "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(",");

    $scope.payoutColumns = [
        {text:"Receipt ID"},
        {text:"Month"},
        {text:"Order Item"},
        {text:"Designer ID",hide:!$rootScope.isAdmin},
        {text:"Designer Name",hide:!$rootScope.isAdmin},
        {text:"Amount"},
        {text:"Quantity"},
        {text:"Payment Date"},
        {text:"Paid"}
    ];

    httpService.getPayouts(payoutRange.from,payoutRange.to,function (response) {
        $scope.payouts = response.data;
        $scope.payouts.forEach(function (payout) {
            payout.lineItems.forEach(function (product) {
                var creationDate = GetFormattedDate(payout.createdAt);
                var invoiceDate = GetFormattedDate(payout.invoiceDate);
                window.payoutTable.row.add([
                    payout.invoiceNumber,
                    $scope.monthNames[creationDate.month]+' '+creationDate.year,
                    product.description,
                    payout.designer.id,
                    payout.designer.firstName+' '+payout.designer.lastName,
                    product.retailPrice,
                    product.quantity,
                    $scope.monthNames[invoiceDate.month]+' '+invoiceDate.day+','+invoiceDate.year,
                    payout.isPaid?'YES':'NO'
                ]).draw(false);
            });
        });
    });

    function GetFormattedDate(dateString) {
        var date = new Date(dateString);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var year = date.getFullYear();
        return {month:month,day:day,year:year};
    }
});
