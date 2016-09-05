/*
 * Copyright 2012-2016 the Flamingo Community.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.exem.flamingo.shared.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.InitializingBean;

/**
 * Jackson Object Mapper Factory.
 *
 * @author Byoung Gon, Kim
 * @since 0.1
 */
public class ObjectMapperFactoryBean implements FactoryBean<ObjectMapper>, InitializingBean {

    private ObjectMapper objectMapper;

    private boolean isIndentOutput = false;

    @Override
    public ObjectMapper getObject() throws Exception {
        return this.objectMapper;
    }

    @Override
    public Class<ObjectMapper> getObjectType() {
        return ObjectMapper.class;
    }

    @Override
    public boolean isSingleton() {
        return true;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        this.objectMapper = new ObjectMapper();

        if (isIndentOutput) {
            this.objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
        }
    }

    public void setIndentOutput(boolean isIndentOutput) {
        this.isIndentOutput = isIndentOutput;
    }
}