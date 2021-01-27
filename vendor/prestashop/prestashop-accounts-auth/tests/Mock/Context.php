<?php

class Context
{
    public $link;

    public function __construct()
    {
        $this->link = new \Link();
    }

    public static function getContext()
    {
        return new self();
    }
}
