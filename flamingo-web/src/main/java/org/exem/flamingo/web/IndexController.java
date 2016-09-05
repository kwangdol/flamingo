package org.exem.flamingo.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/")
public class IndexController {
    /**
     * SLF4J Logging
     */
    private Logger logger = LoggerFactory.getLogger(IndexController.class);

    /**
     * 인덱스 페이지로 이동한다.
     */
    @RequestMapping(method = {RequestMethod.GET, RequestMethod.HEAD})
    public ModelAndView index() {
        return new ModelAndView("/index");
    }
}