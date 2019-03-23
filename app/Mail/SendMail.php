<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendMail extends Mailable
{
    use Queueable, SerializesModels;

    public $param;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($param)
    {
        $this->param["nome"] = $param["nome"];
        $this->param["email"] = $param["email"];
        $this->param["password"] = $param["password"];
        $this->param["projeto"] = $param["projeto"];
        $this->param["site"] = $param["site"];
        $this->param["apiurl"] = $param["apiurl"];
        $this->param["subject"] = $param["subject"];
        $this->param["view"] = $param["view"];
        $this->param["app_name"] = env('APP_NAME');
        $this->param["mail_project"] = env('MAIL_USERNAME');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        if ($this->param["view"] == "bemvindo"){
            return $this->from($this->param["mail_project"], $this->param["app_name"])
                    ->subject($this->param["subject"])
                    ->view($this->param["view"]."-mail")
                    ->with(['nome' => $this->param["nome"], 'email' => $this->param["email"], 'password' => $this->param["password"],'projeto' => $this->param["projeto"], 'site' => $this->param["site"], 'apiurl' => $this->param["apiurl"]]);
        }
        else if ($this->param["view"] == "esqueciasenha"){
            return $this->from($this->param["mail_project"], $this->param["app_name"])
                    ->subject($this->param["subject"])
                    ->view($this->param["view"]."-mail")
                    ->with(['nome' => $this->param["nome"], 'email' => $this->param["email"], 'password' => $this->param["password"],'projeto' => $this->param["projeto"], 'site' => $this->param["site"], 'apiurl' => $this->param["apiurl"]]);
        }
    }

}
