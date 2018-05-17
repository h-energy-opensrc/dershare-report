
62
down vote
accepted
I have come across such a situation a lot in a past project. Since REST is well...about resource, it is not always clear how to deal with things that are Really RPC in nature.

An easy way to get around this is to think of it as the bureaucratic part of rest, the request can be a resource itself :

1 . "You want to trigger a command on my server ? first fill this form I90292 and send it to us" :

POST /bureaucracy/command-request 
Content-Type: application/x-www-form-urlencoded
Content-Length: ...
"Ok we will see what we can do. your case number is 999"

201 Created (or 202 Accepted as per Kugel's comment) Location /bureaucracy/command-request/999

And then the client checks regularly

GET /bureaucracy/command-request/999

Hopefully he gets a response like the following

200 OK
<command-request>
  <number>999</number>
  ...
  <result>Success</result>
</command-request>
Of course if the bureaucratic service has great customer care it would offer the customer to call him when it is done if he wants :
"You want to trigger a command on our server? Kindly fill this form and send it to us. Note that you can join your contact info so we can call you when it is done"

POST /bureaucracy/command-request?callback=client.com/bureaucracy/inbox 
Or as a custom http header  X-Callback: http://client.com/bureaucracy/inbox