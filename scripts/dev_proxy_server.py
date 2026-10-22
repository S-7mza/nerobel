import http.server
import socketserver
import urllib.request
import urllib.error
import sys

PORT = 8099
TARGET_BASE = "https://savnerobel.nexenflow.com"

class ProxyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, X-Requested-With")
        super().end_headers()

    def do_OPTIONS(self):
        if self.path.startswith("/api/"):
            self.send_response(200)
            self.end_headers()
        else:
            super().do_OPTIONS()

    def do_POST(self):
        if self.path.startswith("/api/"):
            target_url = TARGET_BASE + self.path
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)

            forward_headers = {}
            for k, v in self.headers.items():
                if k.lower() not in ['host', 'content-length', 'accept-encoding']:
                    forward_headers[k] = v
            forward_headers['Host'] = 'savnerobel.nexenflow.com'
            forward_headers['Accept-Encoding'] = 'identity'
            if 'User-Agent' not in forward_headers or 'Python' in forward_headers.get('User-Agent', ''):
                forward_headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

            req = urllib.request.Request(target_url, data=post_data, headers=forward_headers, method='POST')
            try:
                with urllib.request.urlopen(req) as response:
                    body = response.read()
                    self.send_response(response.status)
                    for k, v in response.headers.items():
                        if k.lower() not in ['transfer-encoding', 'content-encoding', 'access-control-allow-origin', 'content-length']:
                            self.send_header(k, v)
                    self.send_header('Content-Length', str(len(body)))
                    self.end_headers()
                    self.wfile.write(body)
            except urllib.error.HTTPError as e:
                body = e.read()
                self.send_response(e.code)
                for k, v in e.headers.items():
                    if k.lower() not in ['transfer-encoding', 'content-encoding', 'access-control-allow-origin', 'content-length']:
                        self.send_header(k, v)
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)
            except Exception as ex:
                self.send_response(500)
                err_msg = str(ex).encode('utf-8')
                self.send_header('Content-Type', 'text/plain; charset=utf-8')
                self.send_header('Content-Length', str(len(err_msg)))
                self.end_headers()
                self.wfile.write(err_msg)
        else:
            super().do_POST()

    def do_GET(self):
        if self.path.startswith("/api/"):
            target_url = TARGET_BASE + self.path
            forward_headers = {}
            for k, v in self.headers.items():
                if k.lower() not in ['host', 'accept-encoding']:
                    forward_headers[k] = v
            forward_headers['Host'] = 'savnerobel.nexenflow.com'
            forward_headers['Accept-Encoding'] = 'identity'
            if 'User-Agent' not in forward_headers or 'Python' in forward_headers.get('User-Agent', ''):
                forward_headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

            req = urllib.request.Request(target_url, headers=forward_headers, method='GET')
            try:
                with urllib.request.urlopen(req) as response:
                    body = response.read()
                    self.send_response(response.status)
                    for k, v in response.headers.items():
                        if k.lower() not in ['transfer-encoding', 'content-encoding', 'access-control-allow-origin', 'content-length']:
                            self.send_header(k, v)
                    self.send_header('Content-Length', str(len(body)))
                    self.end_headers()
                    self.wfile.write(body)
            except urllib.error.HTTPError as e:
                body = e.read()
                self.send_response(e.code)
                for k, v in e.headers.items():
                    if k.lower() not in ['transfer-encoding', 'content-encoding', 'access-control-allow-origin', 'content-length']:
                        self.send_header(k, v)
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)
        else:
            super().do_GET()

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), ProxyHTTPRequestHandler) as httpd:
        print(f"Dev proxy server running on http://localhost:{PORT}")
        httpd.serve_forever()
