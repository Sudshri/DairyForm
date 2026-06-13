<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body{font-family:Arial,sans-serif;background:#f4f6f9;margin:0;padding:24px}
  .card{background:#fff;border-radius:10px;max-width:600px;margin:0 auto;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)}
  .header{background:linear-gradient(135deg,#8BC63E,#5A9A1F);padding:28px 32px;color:#fff}
  .header h1{margin:0;font-size:20px;font-weight:700}
  .header p{margin:6px 0 0;opacity:.85;font-size:13px}
  .body{padding:28px 32px;font-size:14px;color:#374151;line-height:1.7}
  .highlight{background:#F0F9E8;border-left:4px solid #8BC63E;border-radius:4px;padding:14px 16px;margin:20px 0}
  table{width:100%;border-collapse:collapse;margin:16px 0}
  td{padding:8px 10px;font-size:13px;border-bottom:1px solid #f0f0f0;color:#374151}
  td:first-child{font-weight:600;color:#6B7280;width:38%}
  .btn{display:inline-block;background:#17C0F2;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;font-size:14px;margin-top:20px}
  .footer{background:#F8FAFC;padding:16px 32px;text-align:center;font-size:12px;color:#9CA3AF;border-top:1px solid #E5E7EB}
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <h1>🤝 Application Received!</h1>
    <p>Thank you for your interest in partnering with EverFresh</p>
  </div>
  <div class="body">
    <p>Dear <strong>{{ $data['full_name'] }}</strong>,</p>
    <p>
      Thank you for submitting your partnership application for <strong>{{ $data['business_name'] }}</strong>.
      We have received your inquiry and our team will review it shortly.
    </p>

    <div class="highlight">
      <strong>What happens next?</strong><br>
      Our partnership team will contact you within <strong>2–3 business days</strong> to discuss terms,
      pricing, and onboarding details.
    </div>

    <p><strong>Your Application Summary</strong></p>
    <table>
      <tr><td>Name</td><td>{{ $data['full_name'] }}</td></tr>
      <tr><td>Business</td><td>{{ $data['business_name'] }}</td></tr>
      <tr><td>Mobile</td><td>{{ $data['mobile'] }}</td></tr>
      <tr><td>Address</td><td>{{ $data['address'] }}</td></tr>
    </table>

    <p>In the meantime, feel free to reach out to us at
      <a href="mailto:contact@everfresh.org.in" style="color:#17C0F2">contact@everfresh.org.in</a>
      if you have any questions.
    </p>
    <a href="mailto:contact@everfresh.org.in" class="btn">Contact Us</a>
  </div>
  <div class="footer">
    EverFresh Dairy &bull; SHYAM DAIRY UDYOG, Palsana, Sikar, Rajasthan – 332001<br>
    FSSAI: 12225039000413 &bull; GST: 08AIYPH7023E1Z2
  </div>
</div>
</body>
</html>
