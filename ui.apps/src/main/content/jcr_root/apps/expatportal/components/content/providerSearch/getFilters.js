response.setHeader("Content-Type", "application/json; charset=UTF-8");
use(function() {

         // TOKEN URL

    var tokenURL= properties.get("tokenURL");//"https://gateway-stage-dmz.optum.com/auth/oauth2/token"
    var grantType = properties.get("grantType","client_credentials"); 
	var clientID = properties.get("clientId"); 
	var clientSecret = properties.get("clientSecret");
    var tokenURLObject = new Packages.java.net.URL(tokenURL);
    var tokenBodyData='{"grant_type":"'+ grantType+'","client_id":"'+ clientID+'","client_secret":"'+ clientSecret+'"}';
    var tokenConnection = tokenURLObject.openConnection();
    tokenConnection.setRequestMethod("POST");
    tokenConnection.setDoOutput(true);
    tokenConnection.setRequestProperty("Content-Type", "application/json");
    var dataOutputStreamToken = new Packages.java.io.DataOutputStream(tokenConnection.getOutputStream());
    dataOutputStreamToken.writeBytes(tokenBodyData);
    dataOutputStreamToken.flush();
    dataOutputStreamToken.close();
    var inputToken = new Packages.java.io.BufferedReader(new Packages.java.io.InputStreamReader(tokenConnection.getInputStream()));
    var inputLineToken = null;
    var responseToken = new Packages.java.lang.StringBuffer();
    while ((inputLineToken = inputToken.readLine()) != null) {
        responseToken.append(inputLineToken);
    }
    inputToken.close();
    var accessSecureToken=JSON.parse(responseToken.toString()).access_token;
    // END TOKEN URL

    var url = properties.get("filtersURL");
	//var url = "http://dev-uhcg-svcs-providers.uhc.com/api/cdm/uhcg/gi/provider-attributes?type=ALL";
	var urlObj = new Packages.java.net.URL(url);
	var con = urlObj.openConnection();
    con.setRequestProperty("Authorization", "Bearer "+accessSecureToken);
	//con.setRequestProperty("Accept-Charset", "UTF-8");
	var input = new Packages.java.io.BufferedReader (new Packages.java.io.InputStreamReader(con.getInputStream()));
	var inputLine = null;
	var response = new Packages.java.lang.StringBuffer();
	while ((inputLine = input.readLine()) != null) {
		response.append(inputLine);
	}
	input.close();
	var jsonString = response.toString();

	try {
		var  json = new Packages.org.json.JSONObject(jsonString);
		log.info("Print full json : "+json.toString());

	} catch(  e) {
		log.error("Json exception ", e);
	}

return json.toString();

});