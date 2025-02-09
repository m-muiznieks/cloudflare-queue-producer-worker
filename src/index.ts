/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.json`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {

		// if the request is a POST request, if messages is sent over https or fetched with worker bindings
		if(request.method === "POST"){
			
			const data = {
				url: request.url,
				method: request.method,
				headers: Object.fromEntries(request.headers),
				body: await request.json(),
			};

			// optional - you can set the request destination in the headers. 
			// Name whatever you want or not use this at all.
			const target = data.headers["x-target"];
			if(!target){
				console.log("No request destination");
				return new Response('No request destination', { status: 400 });
			}


			switch(target) {
				case "x-target-value":
					//console.log("Sending to workflows");
					await env.QUEUE_NAME.send(data.body);
					return new Response('OK', { status: 200 });
			}

			console.error("Unknown destination");
			
			return new Response('Unknown destination', { status: 400 });
		}
		
		console.log("Method not allowed");
		return new Response('Method not allowed', { status: 405 });

	},
} satisfies ExportedHandler<Env>;
