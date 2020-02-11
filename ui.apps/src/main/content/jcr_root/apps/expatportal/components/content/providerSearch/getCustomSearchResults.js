response.setHeader("Content-Type", "application/json; charset=UTF-8");
use(function() {
    var postData = null;
    if ("POST".equalsIgnoreCase(request.getMethod())) {
        var s = null;
        try {
            s = new Packages.java.util.Scanner(request.getInputStream(), "UTF-8").useDelimiter("\\A");
        } catch (e) {
            log.error("Json exception ", e);
        }
        postData = s.hasNext() ? s.next() : "";
    }


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


	var url = properties.get("searchURL");
    //var url = "https://gateway-stage-dmz.optum.com/api/dev/cdm/uhcg/gi/prv/v1.0/providers/search";
    var urlObj = new Packages.java.net.URL(url);
    var con = urlObj.openConnection();
    con.setRequestMethod("POST");
    con.setDoOutput(true);
    con.setRequestProperty("Content-Type", "application/json");
	con.setRequestProperty("cache-control", "no-cache");
    con.setRequestProperty("Authorization", "Bearer "+accessSecureToken);
    var dataOutputStream = new Packages.java.io.DataOutputStream(con.getOutputStream());
    dataOutputStream.writeBytes(postData);
    dataOutputStream.flush();
    dataOutputStream.close();

    var input = new Packages.java.io.BufferedReader(new Packages.java.io.InputStreamReader(con.getInputStream()));
    var inputLine = null;
    var response = new Packages.java.lang.StringBuffer();
    while ((inputLine = input.readLine()) != null) {
        response.append(inputLine);
    }
    input.close();
    var jsonString = response.toString();
    return jsonString.trim();

});