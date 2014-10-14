'use strict';
var app = angular.module('sms').factory('CarrierFactory', ['$http', '$q', 'CarrierService',
    function ($http, $q, CarrierService) {
        var carriers = [
            {
                "carrier": "Airfire Mobile",
                "addr": "@sms.airfiremobile.com"
            },
            {
                "carrier": "Alltel",
                "addr": "@message.alltel.com"
            },
            {
                "carrier": "Alltel (Allied Wireless)",
                "addr": "@sms.alltelwireless.com"
            },
            {
                "carrier": "Alaska Communications",
                "addr": "@msg.acsalaska.com"
            },
            {
                "carrier": "Ameritech",
                "addr": "@paging.acswireless.com"
            },
            {
                "carrier": "Assurance Wireless",
                "addr": "@vmobl.com"
            },
            {
                "carrier": "AT&amp;T Wireless",
                "addr": "@txt.att.net"
            },
            {
                "carrier": "AT&amp;T Mobility (Cingular)",
                "addr": "@txt.att.net"
            },
            {
                "carrier": "AT&amp;T Enterprise Paging",
                "addr": "@page.att.net"
            },
            {
                "carrier": "AT&amp;T Global Smart Messaging Suite",
                "addr": "@sms.smartmessagingsuite.com"
            },
            {
                "carrier": "BellSouth",
                "addr": "@bellsouth.cl"
            },
            {
                "carrier": "Bluegrass Cellular",
                "addr": "@sms.bluecell.com"
            },
            {
                "carrier": "Bluesky Communications",
                "addr": "@psms.bluesky.as"
            },
            {
                "carrier": "BlueSkyFrog",
                "addr": "@blueskyfrog.com"
            },
            {
                "carrier": "Boost Mobile",
                "addr": "@sms.myboostmobile.com"
            },
            {
                "carrier": "Cellcom",
                "addr": "@cellcom.quiktxt.com"
            },
            {
                "carrier": "Cellular South",
                "addr": "@csouth1.com"
            },
            {
                "carrier": "Centennial Wireless",
                "addr": "@cwemail.com"
            },
            {
                "carrier": "Chariton Valley Wireless",
                "addr": "@sms.cvalley.net"
            },
            {
                "carrier": "Chat Mobility",
                "addr": "@mail.msgsender.com"
            },
            {
                "carrier": "Cincinnati Bell",
                "addr": "@gocbw.com"
            },
            {
                "carrier": "Cingular (Postpaid)",
                "addr": "@cingular.com"
            },
            {
                "carrier": "Cleartalk Wireless",
                "addr": "@sms.cleartalk.us"
            },
            {
                "carrier": "Comcast PCS",
                "addr": "@comcastpcs.textmsg.com"
            },
            {
                "carrier": "Cricket",
                "addr": "@sms.mycricket.com"
            },
            {
                "carrier": "C Spire Wireless",
                "addr": "@cspire1.com"
            },
            {
                "carrier": "DTC Wireless",
                "addr": "@sms.advantagecell.net"
            },
            {
                "carrier": "Element Mobile",
                "addr": "@sms.elementmobile.net"
            },
            {
                "carrier": "Esendex",
                "addr": "@echoemail.net"
            },
            {
                "carrier": "General Communications Inc.",
                "addr": "@mobile.gci.net"
            },
            {
                "carrier": "Golden State Cellular",
                "addr": "@gscsms.com"
            },
            {
                "carrier": "Google Voice",
                "addr": "@txt.voice.google.com"
            },
            {
                "carrier": "GreatCall",
                "addr": "@vtext.com"
            },
            {
                "carrier": "Helio",
                "addr": "@myhelio.com"
            },
            {
                "carrier": "i wireless (T-Mobile)",
                "addr": ".iws@iwspcs.net"
            },
            {
                "carrier": "i wireless (Sprint PCS)",
                "addr": "@iwirelesshometext.com"
            },
            {
                "carrier": "Kajeet",
                "addr": "@mobile.kajeet.net"
            },
            {
                "carrier": "LongLines",
                "addr": "@text.longlines.com"
            },
            {
                "carrier": "Metro PCS",
                "addr": "@mymetropcs.com"
            },
            {
                "carrier": "Nextech",
                "addr": "@sms.nextechwireless.com"
            },
            {
                "carrier": "Nextel Direct Connect (Sprint)",
                "addr": "@messaging.nextel.com"
            },
            {
                "carrier": "Page Plus Cellular",
                "addr": "@vtext.com"
            },
            {
                "carrier": "Pioneer Cellular",
                "addr": "@zsend.com"
            },
            {
                "carrier": "PSC Wireless",
                "addr": "@sms.pscel.com"
            },
            {
                "carrier": "Rogers Wireless",
                "addr": "@sms.rogers.com"
            },
            {
                "carrier": "Qwest",
                "addr": "@qwestmp.com"
            },
            {
                "carrier": "Simple Mobile",
                "addr": "@smtext.com"
            },
            {
                "carrier": "Solavei",
                "addr": "@tmomail.net"
            },
            {
                "carrier": "South Central Communications",
                "addr": "@rinasms.com"
            },
            {
                "carrier": "Southern Link",
                "addr": "@page.southernlinc.com"
            },
            {
                "carrier": "Sprint PCS (CDMA)",
                "addr": "@messaging.sprintpcs.com"
            },
            {
                "carrier": "Straight Talk",
                "addr": "@vtext.com"
            },
            {
                "carrier": "Syringa Wireless",
                "addr": "@rinasms.com"
            },
            {
                "carrier": "T-Mobile",
                "addr": "@tmomail.net"
            },
            {
                "carrier": "Teleflip",
                "addr": "@teleflip.com"
            },
            {
                "carrier": "Ting",
                "addr": "@message.ting.com"
            },
            {
                "carrier": "Tracfone",
                "addr": "@mmst5.tracfone.com"
            },
            {
                "carrier": "Telus Mobility",
                "addr": "@msg.telus.com"
            },
            {
                "carrier": "Unicel",
                "addr": "@utext.com"
            },
            {
                "carrier": "US Cellular",
                "addr": "@email.uscc.net"
            },
            {
                "carrier": "USA Mobility",
                "addr": "@usamobility.net"
            },
            {
                "carrier": "Verizon Wireless",
                "addr": "@vtext.com"
            },
            {
                "carrier": "Viaero",
                "addr": "@viaerosms.com"
            },
            {
                "carrier": "Virgin Mobile",
                "addr": "@vmobl.com"
            },
            {
                "carrier": "Voyager Mobile",
                "addr": "@text.voyagermobile.com"
            },
            {
                "carrier": "West Central Wireless",
                "addr": "@sms.wcc.net"
            },
            {
                "carrier": "XIT Communications",
                "addr": "@sms.xit.net"
            },
            {
                "carrier": "Aliant",
                "addr": "@chat.wirefree.ca"
            },
            {
                "carrier": "Bell Mobility &amp; Solo Mobile",
                "addr": "@txt.bell.ca"
            },
            {
                "carrier": "Fido",
                "addr": "@sms.fido.ca"
            },
            {
                "carrier": "Koodo Mobile",
                "addr": "@msg.telus.com"
            },
            {
                "carrier": "Lynx Mobility",
                "addr": "@sms.lynxmobility.com"
            },
            {
                "carrier": "Manitoba Telecom/MTS Mobility",
                "addr": "@text.mtsmobility.com"
            },
            {
                "carrier": "NorthernTel",
                "addr": "@txt.northerntelmobility.com"
            },
            {
                "carrier": "PC Telecom",
                "addr": "@mobiletxt.ca"
            },
            {
                "carrier": "Rogers Wireless",
                "addr": "@sms.rogers.com"
            },
            {
                "carrier": "SaskTel",
                "addr": "@sms.sasktel.com"
            },
            {
                "carrier": "Telebec",
                "addr": "@txt.telebecmobilite.com"
            },
            {
                "carrier": "Telus Mobility",
                "addr": "@msg.telus.com"
            },
            {
                "carrier": "Virgin Mobile",
                "addr": "@vmobile.ca"
            },
            {
                "carrier": "Wind Mobile",
                "addr": "@txt.windmobile.ca"
            },
            {
                "carrier": "CTI Movil (Claro)",
                "addr": "@sms.ctimovil.com.ar"
            },
            {
                "carrier": "Movistar",
                "addr": "@sms.movistar.net.ar"
            },
            {
                "carrier": "Nextel",
                "addr": "TwoWay.@nextel.net.ar"
            },
            {
                "carrier": "Telecom (Personal)",
                "addr": "@alertas.personal.com.ar"
            },
            {
                "carrier": "Setar Mobile",
                "addr": "@mas.aw"
            },
            {
                "carrier": "T-Mobile (Optus Zoo)",
                "addr": "@optusmobile.com.au"
            },
            {
                "carrier": "Mobistar",
                "addr": "@mobistar.be"
            },
            {
                "carrier": "Claro",
                "addr": "@clarotorpedo.com.br"
            },
            {
                "carrier": "Vivo",
                "addr": "@torpedoemail.com.br"
            },
            {
                "carrier": "Globul",
                "addr": "@sms.globul.bg"
            },
            {
                "carrier": "Mobiltel",
                "addr": "@sms.mtel.net"
            },
            {
                "carrier": "China Mobile",
                "addr": "@139.com"
            },
            {
                "carrier": "Comcel",
                "addr": "@comcel.com.co"
            },
            {
                "carrier": "Movistar",
                "addr": "@movistar.com.co"
            },
            {
                "carrier": "Vodaphone",
                "addr": "@vodafonemail.cz"
            },
            {
                "carrier": "Digicel",
                "addr": "@digitextdm.com"
            },
            {
                "carrier": "Mobinil",
                "addr": "@mobinil.net"
            },
            {
                "carrier": "Vodaphone",
                "addr": "@vodafone.com.eg"
            },
            {
                "carrier": "Foroya tele",
                "addr": "@gsm.fo"
            },
            {
                "carrier": "SFR",
                "addr": "@sfr.fr"
            },
            {
                "carrier": "Bouygues Telecom",
                "addr": "@mms.bouyguestelecom.fr"
            },
            {
                "carrier": "E-Plus",
                "addr": "@smsmail.eplus.de"
            },
            {
                "carrier": "O2",
                "addr": "@o2online.de"
            },
            {
                "carrier": "Vodaphone",
                "addr": "@vodafone-sms.de"
            },
            {
                "carrier": "Guyana Telephone &amp; Telegraph",
                "addr": "@sms.cellinkgy.com"
            },
            {
                "carrier": "CSL",
                "addr": "@mgw.mmsc1.hkcsl.com"
            },
            {
                "carrier": "OgVodafone",
                "addr": "@sms.is"
            },
            {
                "carrier": "Siminn",
                "addr": "@box.is"
            },
            {
                "carrier": "Aircel",
                "addr": "@aircel.co.in"
            },
            {
                "carrier": "Aircel - Tamil Nadu",
                "addr": "@airsms.com"
            },
            {
                "carrier": "Airtel",
                "addr": "@airtelmail.com"
            },
            {
                "carrier": "Airtel - Andhra Pradesh",
                "addr": "@airtelap.com"
            },
            {
                "carrier": "Airtel - Chennai",
                "addr": "@airtelchennai.com"
            },
            {
                "carrier": "Airtel - Karnataka",
                "addr": "@airtelkk.com"
            },
            {
                "carrier": "Airtel - Kerala",
                "addr": "@airtelkerala.com"
            },
            {
                "carrier": "Airtel - Kolkata",
                "addr": "@airtelkol.com"
            },
            {
                "carrier": "Airtel - Tamil Nadu",
                "addr": "@airtelmobile.com"
            },
            {
                "carrier": "Celforce",
                "addr": "@celforce.com"
            },
            {
                "carrier": "Escotel Mobile",
                "addr": "@escotelmobile.com"
            },
            {
                "carrier": "Idea Cellular",
                "addr": "@ideacellular.net"
            },
            {
                "carrier": "Loop (BPL Mobile)",
                "addr": "@loopmobile.co.in"
            },
            {
                "carrier": "Orange",
                "addr": "@orangemail.co.in"
            },
            {
                "carrier": "Meteor",
                "addr": "@sms.mymeteor.ie"
            },
            {
                "carrier": "Spikko",
                "addr": "@spikkosms.com"
            },
            {
                "carrier": "Vodaphone",
                "addr": "@sms.vodafone.it"
            },
            {
                "carrier": "AU by KDDI",
                "addr": "@ezweb.ne.jp"
            },
            {
                "carrier": "NTT DoCoMo",
                "addr": "@docomo.ne.jp"
            },
            {
                "carrier": "Vodaphone - Chuugoku/Western",
                "addr": "@n.vodafone.ne.jp"
            },
            {
                "carrier": "Vodaphone - Hokkaido",
                "addr": "@d.vodafone.ne.jp"
            },
            {
                "carrier": "Vodaphone - Hokuriku/Central North",
                "addr": "@r.vodafone.ne.jp"
            },
            {
                "carrier": "Vodaphone - Kansai/West",
                "addr": "@k.vodafone.ne.jp"
            },
            {
                "carrier": "Vodaphone - Kanto",
                "addr": "@k.vodafone.ne.jp"
            },
            {
                "carrier": "Vodaphone - Koushin",
                "addr": "@k.vodafone.ne.jp"
            },
            {
                "carrier": "Vodaphone - Kyuushu",
                "addr": "@q.vodafone.ne.jp"
            },
            {
                "carrier": "Vodaphone - Niigata/North",
                "addr": "@h.vodafone.ne.jp"
            },
            {
                "carrier": "Vodaphone - Okinawa",
                "addr": "@q.vodafone.ne.jp"
            },
            {
                "carrier": "Vodaphone - Osaka",
                "addr": "@k.vodafone.ne.jp"
            },
            {
                "carrier": "Vodaphone - Shikoku",
                "addr": "@s.vodafone.ne.jp"
            },
            {
                "carrier": "Vodaphone - Tokyo",
                "addr": "@k.vodafone.ne.jp"
            },
            {
                "carrier": "Vodaphone - Touhoku",
                "addr": "@h.vodafone.ne.jp"
            },
            {
                "carrier": "Vodaphone - Toukai",
                "addr": "@h.vodafone.ne.jp"
            },
            {
                "carrier": "Willcom",
                "addr": "@pdx.ne.jp"
            },
            {
                "carrier": "Emtel",
                "addr": "@emtelworld.net"
            },
            {
                "carrier": "Nextel",
                "addr": "@msgnextel.com.mx"
            },
            {
                "carrier": "Ncell",
                "addr": "@sms.ncell.com.np"
            },
            {
                "carrier": "Orange",
                "addr": "@sms.orange.nl"
            },
            {
                "carrier": "T-Mobile",
                "addr": "@gin.nl"
            },
            {
                "carrier": "Telecom",
                "addr": "@etxt.co.nz"
            },
            {
                "carrier": "Vodafone",
                "addr": "@mtxt.co.nz"
            },
            {
                "carrier": "Mas Movil",
                "addr": "@cwmovil.com"
            },
            {
                "carrier": "Orange Polska",
                "addr": "@sms.orange.pl"
            },
            {
                "carrier": "Polkomtel",
                "addr": "+@text.plusgsm.pl"
            },
            {
                "carrier": "Plus",
                "addr": "+@text.plusgsm.pl"
            },
            {
                "carrier": "Claro",
                "addr": "@vtexto.com"
            },
            {
                "carrier": "Beeline",
                "addr": "@sms.beemail.ru"
            },
            {
                "carrier": "M1",
                "addr": "@m1.com.sg"
            },
            {
                "carrier": "MTN",
                "addr": "@sms.co.za"
            },
            {
                "carrier": "Vodacom",
                "addr": "@voda.co.za"
            },
            {
                "carrier": "Helio",
                "addr": "@myhelio.com"
            },
            {
                "carrier": "Esendex",
                "addr": "@esendex.net"
            },
            {
                "carrier": "Movistar/Telefonica",
                "addr": "@movistar.net"
            },
            {
                "carrier": "Vodaphone",
                "addr": "@vodafone.es"
            },
            {
                "carrier": "Mobitel",
                "addr": "@sms.mobitel.lk"
            },
            {
                "carrier": "Tele2",
                "addr": "@sms.tele2.se"
            },
            {
                "carrier": "Sunrise Communications",
                "addr": "@gsm.sunrise.ch"
            },
            {
                "carrier": "Beeline",
                "addr": "@sms.beeline.ua"
            },
            {
                "carrier": "aql",
                "addr": "@text.aql.com"
            },
            {
                "carrier": "Esendex",
                "addr": "@echoemail.net"
            },
            {
                "carrier": "HSL Mobile (Hay Systems Ltd)",
                "addr": "@sms.haysystems.com"
            },
            {
                "carrier": "O2",
                "addr": "@mmail.co.uk"
            },
            {
                "carrier": "Orange",
                "addr": "@orange.net"
            },
            {
                "carrier": "T-Mobile",
                "addr": "@t-mobile.uk.net"
            },
            {
                "carrier": "Txtlocal",
                "addr": "@txtlocal.co.uk"
            },
            {
                "carrier": "UniMovil Corporation",
                "addr": "@viawebsms.com"
            },
            {
                "carrier": "Movistar",
                "addr": "@sms.movistar.com.uy"
            },
            {
                "carrier": "TellusTalk",
                "addr": "@esms.nu"
            },
            {
                "carrier": "Movistar",
                "addr": "@movimensaje.com.ar"
            },
            {
                "carrier": "Globalstar satellite",
                "addr": "@msg.globalstarusa.com"
            },
            {
                "carrier": "Iridium satellite",
                "addr": "@msg.iridium.com"
            }
        ];

        var cs = CarrierService;

        var deferred = $q.defer();

        function success(data, status, headers, config) {
            console.log(data);

            // if success, cache it
            if (data.clientMessage === "") {
                cs.setCarriers(data.data);
            } else if (!cs.getCarriers()) {
                // if no cache, return set local copy
                cs.setCarriers(carriers);
            }

            deferred.resolve(cs.getCarriers());

        }

        function error(data, status, headers, config) {
            console.log(data);

            if (!cs.getCarriers()) {
                // if no cache, return set local copy
                cs.setCarriers(carriers);
            }

            deferred.resolve(cs.getCarriers());
        }

        function getCarriers() {
            // get cached copy if available
            if (cs.getCarriers()) {
                deferred.resolve(cs.getCarriers());
            } else {
                $http.get('/api/file/sms').
                    success(success).
                    error(error);
            }
            return deferred.promise;

        }

        return {
            getCarriers: getCarriers
        };

    }
]);
app.service('CarrierService', ['$rootScope', function ($rootScope) {
    this.cachedCarriers = null;
    this.setCarriers = function (cr) {
        this.cachedCarriers = cr;
        $rootScope.$broadcast('carrier.update');
    };
    this.getCarriers = function () {
        return this.cachedCarriers;
    };

}]);