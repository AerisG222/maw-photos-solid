#!/bin/bash

podman run --rm \
    --name staging-maw-photos \
    --publish "4200:4200" \
    --volume "/home/mmorano/maw-photos/staging/certificates/:/certs:ro,Z" \
    localhost/maw-photos-staging
