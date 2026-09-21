// XMLHttpRequest() = a built-in class provided by javascript 
// It Creates a new HTTP message to send to the backend
// message = request

// give open() two parameters
// 1- Type of HTTP message (e.g, 'GET')
// 2- Where to send the HTTP message,  'url' = uniform resource locator (Like an address, but for the internet)
// URL helps us locate another computer on the internet. (e.g, https://amazon.com, https://youtube.com , https://supersimple.dev
// URL = (HTTP + Domain name)
// GET = get some information from the backend
// Types of Requests
// 1- GET
// 2- POST
// 3- PUT
// 4- DELETE
// View HTTP Requests/Responses in network tab 
// Request-Response Cycle = 1 request, 1 response
// .send() method = used to send request to some other computer/website online
// .response() = returns response from where request has been sent
// It takes time for the request to travel across the internet
// It takes time , so written with addEventListener() as async code
// URL Paths = paths that come after the domain name (e.g, https://supersimplebackend.dev/hello , 'hello' = URL Path),
//  (https://supersimplebackend.dev/products/first, '/products/first' = URL Path)
// (https://supersimplebackend.dev, '/' = URL Path)
// Each URL Path will give us a different response
// Try Sending requests to different URL Paths
// A backend only supports a certain set of URL paths
// If we send a request to a URL path that is not supported, the backend will respond with an error.
// Try a URL path that is not supported (e.g, https://supersimplebackend.dev/not-supported)
// Whenever we get response from backend, it also returns status code with response which tells if request is succeeded or failed
// Status Code = Starts with 4 or 5 (400, 404, 500) = failed
// Starting with 4 = Our problem (we sent request to the URL path which is not supported)
// Starting with 5 = Backend's problem (Server crashed)
// Starting with 2 = (200, 201, 204) = Succeeded
// How do we know which URL paths are supported and which are not?
// Some backends provide a documentation page which list the URL paths that are supported and the responses they can give
// e.g, https://supersimplebackend.dev/documentation
// Backend API = List of all the URL paths that are supported by backend 
// API = Application Programming Interface
// Interface = How we interact with something?
// The backend can respond with different types of data 
// 1- Text 
// 2- JSON
// 3- HTML
// 4- Image
// JSON.parse() = to convert back a JSON object into JavaScript object
// JSON.parse() = This allows us to send JavaScript objects across the internet, to the backend
// Using the browser = making a 'GET' request
// Depending on the type of response, the browser can display the response in a more useful way.
// Use a backend in our project
// Instead of using the file to load the products, Use the backend to load the products
// Testing from the backend
// done() = lets us control when to go to the next step
// Promises = better way to handle asynchronous code
// Promises = similar to done() function
// Promises = lets us for some code to finish, before going to the next step
// When we create the promise, it runs its parameter/inner function immediately
// resolve = parameter in promise
// resolve = a function = similar to done() function
// resolve = lets us control when to go to the next step
// Add some asynchronous code to the promise
// Promises = Allows JavaScript to do multiple things at the same time
// The next step is separate from the rest of the code
// then()
// Why do we use Promises?
// Callback hell = Multiple callbacks cause a lot of nesting
// Nesting = Code inside Code
// Loading cart from the backend
// If we have lots of callbacks, our code will become more and more nested
// Multiple callbacks cause a lot of nesting
// All these indents become hard to work with
// Promises let us flatten our code
// Promise help keep our code flat and avoid too much nesting
// It is recommended to use promises instead of callbacks
// We can run multiple promises at the same time 
// Promise.all() = lets us run multiple promises at the same time and wait for all of them to finish
// Create array of promises for "Promise.all()"
// Add a next step to Promise.all()
// fetch() = better way to make HTTP requests
 
const xhr = new XMLHttpRequest();
xhr.addEventListener('load', ()=>{
    console.log(xhr.response);
});
// xhr.open('GET', 'https://supersimplebackend.dev')
// xhr.open('GET', 'https://supersimplebackend.dev/hello');
// xhr.open('GET', 'https://supersimplebackend.dev/products/first');
// xhr.open('GET', 'https://supersimplebackend.dev/not-supported');

// xhr.open('GET', 'https://supersimplebackend.dev/hello') (Text)
// xhr.open('GET', 'https://supersimplebackend.dev/products/first') (JSON)
// xhr.open('GET', 'https://supersimplebackend.dev/documentation'); (HTML)
// xhr.open('GET', 'https://supersimplebackend.dev/images/apple.jpg');
xhr.open('GET', 'https://supersimplebackend.dev');
xhr.send();
