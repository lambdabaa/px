#!/usr/bin/env bash

BUILD="build"
PUBLIC="public"

LESS_SRC="$BUILD/style.less"
LESS_DST="$PUBLIC/style.css"
LESS_INCLUDE="less:third_party/bootstrap/less"

PLOVR="bin/plovr-eba786b34df9.jar"
PLOVR_CONF="plovr.json"
PLOVR_DST="$PUBLIC/px.js"


function build_less {
  echo "Compile less to css..."
  files=`find less -name "*.less"`
  files="$files third_party/bootstrap/less/bootstrap.less"
  files="$files third_party/bootstrap/less/responsive.less"
  cat $files > $LESS_SRC
  lessc --strict-imports --verbose --yui-compress -O2 --include-path=$LESS_INCLUDE $LESS_SRC $LESS_DST
  log_build_results $LESS_DST
}


function build_closure {
  echo "Compile closure to javascript..."
  java -jar $PLOVR build $PLOVR_CONF > $PLOVR_DST
  log_build_results $PLOVR_DST
}


function setup {
  echo "Initialize build environment..."
  mkdir -p $PUBLIC
  mkdir -p $BUILD
}


function cleanup {
  echo "Discard build artifacts..."
  rm -rf $BUILD
}


function log_build_results {
  results="`du -h $1` built by `whoami` `date`"
  echo $results
}


setup
build_less
build_closure
cleanup
echo "Done"
