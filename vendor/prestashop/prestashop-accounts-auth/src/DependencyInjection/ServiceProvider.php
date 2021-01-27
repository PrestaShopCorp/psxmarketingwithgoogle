<?php

namespace PrestaShop\AccountsAuth\DependencyInjection;

use PrestaShop\AccountsAuth\Exception\ServiceNotFoundException;

abstract class ServiceProvider
{
    /**
     * @var array kinda service container
     */
    protected $container = [];

    /**
     * @var static
     */
    protected static $instance;

    final public function __construct()
    {
        $this->register();
    }

    /**
     * @return void
     */
    abstract public function register();

    /**
     * @return static
     */
    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new static();
        }

        return self::$instance;
    }

    /**
     * @param string $class
     *
     * @return mixed
     *
     * @throws ServiceNotFoundException
     */
    public function get($class)
    {
        if (false === array_key_exists($class, $this->container)) {
            $msg = 'Dependency not found : ' . $class;
            error_log($msg);
            throw new ServiceNotFoundException($msg);
        }

        $dependency = $this->container[$class];
        if (is_callable($dependency)) {
            $this->container[$class] = $dependency();
        }

        return $this->container[$class];
    }

    /**
     * @param mixed $class
     * @param mixed $instance
     *
     * @return void
     */
    public function singleton($class, $instance = null)
    {
        if (func_num_args() == 1) {
            $instance = $class;
            $class = get_class($instance);
        }

        $this->container[$class] = $instance;
    }

    /**
     * Empties dependency cache
     *
     * @return void
     */
    public function reset()
    {
        $this->container = [];
        $this->register();
    }

    /**
     * Utility method to build dependencies for a given method
     *
     * @param mixed $method
     * @param array $params
     *
     * @return array
     *
     * @throws \ReflectionException
     * @throws \Exception
     */
    public function buildMethodDependencies($method, array $params = [])
    {
        $reflectionMethod = $method;
        if (!$method instanceof \ReflectionMethod) {
            $reflectionMethod = new \ReflectionMethod(get_class($method), '__construct');
        }

        $dependencies = [];

        foreach ($reflectionMethod->getParameters() as $index => $reflectionParameter) {
            $param = $reflectionParameter->getName();

            if (!isset($params[$index]) || $params[$index] == null) {
                $dependencies[$param] = $this->get($reflectionParameter->getClass()->getName());
            } else {
                $dependencies[$param] = $params[$index];
            }
        }

        return $dependencies;
    }
}
