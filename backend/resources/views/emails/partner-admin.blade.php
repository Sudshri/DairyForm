<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body{font-family:Arial,sans-serif;background:#f4f6f9;margin:0;padding:24px}
  .card{background:#fff;border-radius:10px;max-width:600px;margin:0 auto;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)}
  .header{background:linear-gradient(135deg,#0D3B6E,#17C0F2);padding:28px 32px;color:#fff}
  .header h1{margin:0;font-size:20px;font-weight:700}
  .header p{margin:6px 0 0;opacity:.85;font-size:13px}
  .body{padding:28px 32px}
  table{width:100%;border-collapse:collapse;margin-bottom:20px}
  td{padding:10px 12px;font-size:14px;border-bottom:1px solid #f0f0f0;color:#374151}
  td:first-child{font-weight:600;color:#6B7280;width:38%}
  .msg-box{background:#F8FAFC;border-left:4px solid #17C0F2;border-radius:4px;padding:14px 16px;font-size:14px;color:#374151;line-height:1.6;white-space:pre-wrap}
  .footer{background:#F8FAFC;padding:16px 32px;text-align:center;font-size:12px;color:#9CA3AF;border-top:1px solid #E5E7EB}
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <h1>🤝 New Partnership Application</h1>
    <p>Received via everfresh.org.in</p>
  </div>
  <div class="body">
    <table>
      <tr><td>Full Name</td><td>{{ $data['full_name'] }}</td></tr>
      <tr><td>Mobile</td><td>{{ $data['mobile'] }}</td></tr>
      <tr><td>Email</td><td><a href="mailto:{{ $data['email'] }}" style="color:#17C0F2">{{ $data['email'] }}</a></td></tr>
      <tr><td>Business Name</td><td>{{ $data['business_name'] }}</td></tr>
      <tr><td>Business Address</td><td>{{ $data['address'] }}</td></tr>
    </table>
    <p style="font-weight:600;color:#6B7280;font-size:13px;margin-bottom:8px">Message</p>
    <div class="msg-box">{{ $data['message'] }}</div>
  </div>
  <div class="footer">EverFresh Dairy &bull; SHYAM DAIRY UDYOG, Palsana, Sikar, Rajasthan – 332001</div>
</div>
</body>
</html>
