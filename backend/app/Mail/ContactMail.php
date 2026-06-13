<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\SerializesModels;

class ContactMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly array $data) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Contact Enquiry: ' . ($this->data['subject'] ?? 'General Enquiry'),
            replyTo: [new Address(
                $this->data['email'] ?? config('mail.from.address'),
                $this->data['name']  ?? 'Visitor'
            )],
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.contact');
    }

    public function attachments(): array { return []; }
}
