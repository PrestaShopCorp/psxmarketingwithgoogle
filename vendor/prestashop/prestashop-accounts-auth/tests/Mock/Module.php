<?php

class Module
{
    public static function getInstanceByName($name)
    {
        return new self();
    }
}
