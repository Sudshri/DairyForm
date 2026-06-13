<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>New Contact Enquiry</title>
<style>
  body { font-family: Arial, sans-serif; background:#f4f7f9; margin:0; padding:0; }
  .wrap { max-width:600px; margin:32px auto; background:#fff; border-radius:12px; overflow:hidden; border:1px solid #e2e8f0; }
  .header { background:linear-gradient(135deg,#17C0F2,#168AC7); padding:32px 32px 24px; }
  .header h1 { color:#fff; margin:0; font-size:22px; font-weight:700; }
  .header p  { color:rgba(255,255,255,0.85); margin:6px 0 0; font-size:14px; }
  .body { padding:28px 32px; }
  .row { display:flex; gap:12px; margin-bottom:16px; }
  .field { flex:1; background:#f8faff; border:1px solid #e2eaf5; border-radius:8px; padding:12px 16px; }
  .field label { display:block; font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.6px; margin-bottom:4px; }
  .field span  { font-size:15px; color:#1e293b; font-weight:500; }
  .msg  { background:#f8faff; border:1px solid #e2eaf5; border-radius:8px; padding:16px; margin-top:4px; line-height:1.7; color:#334155; font-size:14px; }
  .footer { background:#f8faff; border-top:1px solid #e2e8f0; padding:16px 32px; font-size:12px; color:#94a3b8; text-align:center; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>📩 New Contact Enquiry</h1>
    <p>EverFresh — contact@everfresh.org.in</p>
  </div>
  <div class="body">
    <div class="row">
      <div class="field">
        <label>Name</label>
        <span>{{ $data['name'] ?? '—' }}</span>
      </div>
      <div class="field">
        <label>Mobile</label>
        <span>{{ $data['mobile'] ?? '—' }}</span>
      </div>
    </div>
    <div class="row">
      <div class="field">
        <label>Email</label>
        <span>{{ $data['email'] ?? '—' }}</span>
      </div>
    </div>
    <div class="field" style="margin-bottom:16px">
      <label>Subject</label>
      <span>{{ $data['subject'] ?? '—' }}</span>
    </div>
    <div class="field">
      <label>Message</label>
    </div>
    <div class="msg">{{ $data['message'] ?? '—' }}</div>
  </div>
  <div class="footer">
    Sent from EverFresh website &bull; SHYAM DAIRY UDYOG, Palsana, Sikar, Rajasthan
  </div>
</div>
</body>
</html>
