/*
 * Scene Suite 10 - Sheet Helper 0.6.44
 * 제작 및 통합: @EOOOOORK
 * 시트 HTML 인식: 공개 및 커스텀 시트 호환
 * 속성 변화 알림 참고: https://github.com/kibkibe/roll20-api-scripts/tree/master/attribute_tracker
 */

var KIBScene = KIBScene || {};
var KIBSheetHelper = KIBSheetHelper || {};
var KIBSheetContracts = KIBSheetContracts || [];

/* SCENE_SUITE_SHEET_RECOGNITION_START */
(function () {
  /*!
   * Self-contained Brotli JSON decoder bundle
   *
   * This bundle includes code from brotli.js, base64-js, and the Browserify runtime.
   *
   * MIT License
   *
   * Copyright (c) Devon Govett
   * Copyright (c) 2014 Jameson Little
   * Copyright (c) 2010 James Halliday (mail@substack.net)
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   * Apache License
   * Version 2.0, January 2004
   * http://www.apache.org/licenses/
   *
   * TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION
   *
   * 1. Definitions.
   *
   * "License" shall mean the terms and conditions for use, reproduction,
   * and distribution as defined by Sections 1 through 9 of this document.
   *
   * "Licensor" shall mean the copyright owner or entity authorized by
   * the copyright owner that is granting the License.
   *
   * "Legal Entity" shall mean the union of the acting entity and all
   * other entities that control, are controlled by, or are under common
   * control with that entity. For the purposes of this definition,
   * "control" means (i) the power, direct or indirect, to cause the
   * direction or management of such entity, whether by contract or
   * otherwise, or (ii) ownership of fifty percent (50%) or more of the
   * outstanding shares, or (iii) beneficial ownership of such entity.
   *
   * "You" (or "Your") shall mean an individual or Legal Entity
   * exercising permissions granted by this License.
   *
   * "Source" form shall mean the preferred form for making modifications,
   * including but not limited to software source code, documentation
   * source, and configuration files.
   *
   * "Object" form shall mean any form resulting from mechanical
   * transformation or translation of a Source form, including but
   * not limited to compiled object code, generated documentation,
   * and conversions to other media types.
   *
   * "Work" shall mean the work of authorship, whether in Source or
   * Object form, made available under the License, as indicated by a
   * copyright notice that is included in or attached to the work
   * (an example is provided in the Appendix below).
   *
   * "Derivative Works" shall mean any work, whether in Source or Object
   * form, that is based on (or derived from) the Work and for which the
   * editorial revisions, annotations, elaborations, or other modifications
   * represent, as a whole, an original work of authorship. For the purposes
   * of this License, Derivative Works shall not include works that remain
   * separable from, or merely link (or bind by name) to the interfaces of,
   * the Work and Derivative Works thereof.
   *
   * "Contribution" shall mean any work of authorship, including
   * the original version of the Work and any modifications or additions
   * to that Work or Derivative Works thereof, that is intentionally
   * submitted to Licensor for inclusion in the Work by the copyright owner
   * or by an individual or Legal Entity authorized to submit on behalf of
   * the copyright owner. For the purposes of this definition, "submitted"
   * means any form of electronic, verbal, or written communication sent
   * to the Licensor or its representatives, including but not limited to
   * communication on electronic mailing lists, source code control systems,
   * and issue tracking systems that are managed by, or on behalf of, the
   * Licensor for the purpose of discussing and improving the Work, but
   * excluding communication that is conspicuously marked or otherwise
   * designated in writing by the copyright owner as "Not a Contribution."
   *
   * "Contributor" shall mean Licensor and any individual or Legal Entity
   * on behalf of whom a Contribution has been received by Licensor and
   * subsequently incorporated within the Work.
   *
   * 2. Grant of Copyright License. Subject to the terms and conditions of
   * this License, each Contributor hereby grants to You a perpetual,
   * worldwide, non-exclusive, no-charge, royalty-free, irrevocable
   * copyright license to reproduce, prepare Derivative Works of,
   * publicly display, publicly perform, sublicense, and distribute the
   * Work and such Derivative Works in Source or Object form.
   *
   * 3. Grant of Patent License. Subject to the terms and conditions of
   * this License, each Contributor hereby grants to You a perpetual,
   * worldwide, non-exclusive, no-charge, royalty-free, irrevocable
   * (except as stated in this section) patent license to make, have made,
   * use, offer to sell, sell, import, and otherwise transfer the Work,
   * where such license applies only to those patent claims licensable
   * by such Contributor that are necessarily infringed by their
   * Contribution(s) alone or by combination of their Contribution(s)
   * with the Work to which such Contribution(s) was submitted. If You
   * institute patent litigation against any entity (including a
   * cross-claim or counterclaim in a lawsuit) alleging that the Work
   * or a Contribution incorporated within the Work constitutes direct
   * or contributory patent infringement, then any patent licenses
   * granted to You under this License for that Work shall terminate
   * as of the date such litigation is filed.
   *
   * 4. Redistribution. You may reproduce and distribute copies of the
   * Work or Derivative Works thereof in any medium, with or without
   * modifications, and in Source or Object form, provided that You
   * meet the following conditions:
   *
   * (a) You must give any other recipients of the Work or
   * Derivative Works a copy of this License; and
   *
   * (b) You must cause any modified files to carry prominent notices
   * stating that You changed the files; and
   *
   * (c) You must retain, in the Source form of any Derivative Works
   * that You distribute, all copyright, patent, trademark, and
   * attribution notices from the Source form of the Work,
   * excluding those notices that do not pertain to any part of
   * the Derivative Works; and
   *
   * (d) If the Work includes a "NOTICE" text file as part of its
   * distribution, then any Derivative Works that You distribute must
   * include a readable copy of the attribution notices contained
   * within such NOTICE file, excluding those notices that do not
   * pertain to any part of the Derivative Works, in at least one
   * of the following places: within a NOTICE text file distributed
   * as part of the Derivative Works; within the Source form or
   * documentation, if provided along with the Derivative Works; or,
   * within a display generated by the Derivative Works, if and
   * wherever such third-party notices normally appear. The contents
   * of the NOTICE file are for informational purposes only and
   * do not modify the License. You may add Your own attribution
   * notices within Derivative Works that You distribute, alongside
   * or as an addendum to the NOTICE text from the Work, provided
   * that such additional attribution notices cannot be construed
   * as modifying the License.
   *
   * You may add Your own copyright statement to Your modifications and
   * may provide additional or different license terms and conditions
   * for use, reproduction, or distribution of Your modifications, or
   * for any such Derivative Works as a whole, provided Your use,
   * reproduction, and distribution of the Work otherwise complies with
   * the conditions stated in this License.
   *
   * 5. Submission of Contributions. Unless You explicitly state otherwise,
   * any Contribution intentionally submitted for inclusion in the Work
   * by You to the Licensor shall be under the terms and conditions of
   * this License, without any additional terms or conditions.
   * Notwithstanding the above, nothing herein shall supersede or modify
   * the terms of any separate license agreement you may have executed
   * with Licensor regarding such Contributions.
   *
   * 6. Trademarks. This License does not grant permission to use the trade
   * names, trademarks, service marks, or product names of the Licensor,
   * except as required for reasonable and customary use in describing the
   * origin of the Work and reproducing the content of the NOTICE file.
   *
   * 7. Disclaimer of Warranty. Unless required by applicable law or
   * agreed to in writing, Licensor provides the Work (and each
   * Contributor provides its Contributions) on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
   * implied, including, without limitation, any warranties or conditions
   * of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
   * PARTICULAR PURPOSE. You are solely responsible for determining the
   * appropriateness of using or redistributing the Work and assume any
   * risks associated with Your exercise of permissions under this License.
   *
   * 8. Limitation of Liability. In no event and under no legal theory,
   * whether in tort (including negligence), contract, or otherwise,
   * unless required by applicable law (such as deliberate and grossly
   * negligent acts) or agreed to in writing, shall any Contributor be
   * liable to You for damages, including any direct, indirect, special,
   * incidental, or consequential damages of any character arising as a
   * result of this License or out of the use or inability to use the
   * Work (including but not limited to damages for loss of goodwill,
   * work stoppage, computer failure or malfunction, or any and all
   * other commercial damages or losses), even if such Contributor
   * has been advised of the possibility of such damages.
   *
   * 9. Accepting Warranty or Additional Liability. While redistributing
   * the Work or Derivative Works thereof, You may choose to offer,
   * and charge a fee for, acceptance of support, warranty, indemnity,
   * or other liability obligations and/or rights consistent with this
   * License. However, in accepting such obligations, You may act only
   * on Your own behalf and on Your sole responsibility, not on behalf
   * of any other Contributor, and only if You agree to indemnify,
   * defend, and hold each Contributor harmless for any liability
   * incurred by, or claims asserted against, such Contributor by reason
   * of your accepting any such warranty or additional liability.
   *
   * END OF TERMS AND CONDITIONS
   *
   * APPENDIX: How to apply the Apache License to your work.
   *
   * To apply the Apache License to your work, attach the following
   * boilerplate notice, with the fields enclosed by brackets "[]"
   * replaced with your own identifying information. (Don't include
   * the brackets!)  The text should be enclosed in the appropriate
   * comment syntax for the file format. We also recommend that a
   * file or class name and description of purpose be included on the
   * same "printed page" as the copyright notice for easier
   * identification within third-party archives.
   *
   * Copyright 2013 Google Inc. All Rights Reserved.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var DecodeBrotliJson = (function () {
    var self = {};
    (function (module, exports, define, window, global) {
      !function(e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).DecodeBrotliJson=e()}(function(){return function e(n,t,r){function i(s,f){if(!t[s]){if(!n[s]){var a="function"==typeof require&&require;if(!f&&a)return a(s,!0);if(o)return o(s,!0);var w=new Error("Cannot find module '"+s+"'");throw w.code="MODULE_NOT_FOUND",w}var d=t[s]={exports:{}};n[s][0].call(d.exports,function(e){return i(n[s][1][e]||e)},d,d.exports,e,n,t,r)}return t[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)i(r[s]);return i}({1:[function(e,n,t){var r=e("brotli/decompress"),i=e("base64-js").toByteArray;n.exports=function(e){for(var n=r(i(e)),t=[],o=[],s=0;s<n.length;s+=1)o.push(n[s]),8192===o.length&&(t.push(String.fromCharCode.apply(null,o)),o.length=0);return o.length&&t.push(String.fromCharCode.apply(null,o)),t.join("")}},{"base64-js":2,"brotli/decompress":13}],2:[function(e,n,t){"use strict";t.byteLength=function(e){var n=a(e),t=n[0],r=n[1];return 3*(t+r)/4-r},t.toByteArray=function(e){var n,t,r=a(e),s=r[0],f=r[1],w=new o(function(e,n,t){return 3*(n+t)/4-t}(0,s,f)),d=0,u=f>0?s-4:s;for(t=0;t<u;t+=4)n=i[e.charCodeAt(t)]<<18|i[e.charCodeAt(t+1)]<<12|i[e.charCodeAt(t+2)]<<6|i[e.charCodeAt(t+3)],w[d++]=n>>16&255,w[d++]=n>>8&255,w[d++]=255&n;return 2===f&&(n=i[e.charCodeAt(t)]<<2|i[e.charCodeAt(t+1)]>>4,w[d++]=255&n),1===f&&(n=i[e.charCodeAt(t)]<<10|i[e.charCodeAt(t+1)]<<4|i[e.charCodeAt(t+2)]>>2,w[d++]=n>>8&255,w[d++]=255&n),w},t.fromByteArray=function(e){for(var n,t=e.length,i=t%3,o=[],s=16383,f=0,a=t-i;f<a;f+=s)o.push(d(e,f,f+s>a?a:f+s));return 1===i?(n=e[t-1],o.push(r[n>>2]+r[n<<4&63]+"==")):2===i&&(n=(e[t-2]<<8)+e[t-1],o.push(r[n>>10]+r[n>>4&63]+r[n<<2&63]+"=")),o.join("")};for(var r=[],i=[],o="undefined"!=typeof Uint8Array?Uint8Array:Array,s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",f=0;f<64;++f)r[f]=s[f],i[s.charCodeAt(f)]=f;function a(e){var n=e.length;if(n%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var t=e.indexOf("=");return-1===t&&(t=n),[t,t===n?0:4-t%4]}function w(e){return r[e>>18&63]+r[e>>12&63]+r[e>>6&63]+r[63&e]}function d(e,n,t){for(var r,i=[],o=n;o<t;o+=3)r=(e[o]<<16&16711680)+(e[o+1]<<8&65280)+(255&e[o+2]),i.push(w(r));return i.join("")}i["-".charCodeAt(0)]=62,i["_".charCodeAt(0)]=63},{}],3:[function(e,n,t){var r=4096,i=new Uint32Array([0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535,131071,262143,524287,1048575,2097151,4194303,8388607,16777215]);function o(e){this.buf_=new Uint8Array(8224),this.input_=e,this.reset()}o.READ_SIZE=r,o.IBUF_MASK=8191,o.prototype.reset=function(){this.buf_ptr_=0,this.val_=0,this.pos_=0,this.bit_pos_=0,this.bit_end_pos_=0,this.eos_=0,this.readMoreInput();for(var e=0;e<4;e++)this.val_|=this.buf_[this.pos_]<<8*e,++this.pos_;return this.bit_end_pos_>0},o.prototype.readMoreInput=function(){if(!(this.bit_end_pos_>256))if(this.eos_){if(this.bit_pos_>this.bit_end_pos_)throw new Error("Unexpected end of input "+this.bit_pos_+" "+this.bit_end_pos_)}else{var e=this.buf_ptr_,n=this.input_.read(this.buf_,e,r);if(n<0)throw new Error("Unexpected end of input");if(n<r){this.eos_=1;for(var t=0;t<32;t++)this.buf_[e+n+t]=0}if(0===e){for(t=0;t<32;t++)this.buf_[8192+t]=this.buf_[t];this.buf_ptr_=r}else this.buf_ptr_=0;this.bit_end_pos_+=n<<3}},o.prototype.fillBitWindow=function(){for(;this.bit_pos_>=8;)this.val_>>>=8,this.val_|=this.buf_[8191&this.pos_]<<24,++this.pos_,this.bit_pos_=this.bit_pos_-8>>>0,this.bit_end_pos_=this.bit_end_pos_-8>>>0},o.prototype.readBits=function(e){32-this.bit_pos_<e&&this.fillBitWindow();var n=this.val_>>>this.bit_pos_&i[e];return this.bit_pos_+=e,n},n.exports=o},{}],4:[function(e,n,t){t.lookup=new Uint8Array([0,0,0,0,0,0,0,0,0,4,4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,12,16,12,12,20,12,16,24,28,12,12,32,12,36,12,44,44,44,44,44,44,44,44,44,44,32,32,24,40,28,12,12,48,52,52,52,48,52,52,52,48,52,52,52,52,52,48,52,52,52,52,52,48,52,52,52,52,52,24,12,28,12,12,12,56,60,60,60,56,60,60,60,56,60,60,60,60,60,56,60,60,60,60,60,56,60,60,60,60,60,24,12,28,12,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,56,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,11,11,11,11,12,12,12,12,13,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,22,22,22,22,23,23,23,23,24,24,24,24,25,25,25,25,26,26,26,26,27,27,27,27,28,28,28,28,29,29,29,29,30,30,30,30,31,31,31,31,32,32,32,32,33,33,33,33,34,34,34,34,35,35,35,35,36,36,36,36,37,37,37,37,38,38,38,38,39,39,39,39,40,40,40,40,41,41,41,41,42,42,42,42,43,43,43,43,44,44,44,44,45,45,45,45,46,46,46,46,47,47,47,47,48,48,48,48,49,49,49,49,50,50,50,50,51,51,51,51,52,52,52,52,53,53,53,53,54,54,54,54,55,55,55,55,56,56,56,56,57,57,57,57,58,58,58,58,59,59,59,59,60,60,60,60,61,61,61,61,62,62,62,62,63,63,63,63,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),t.lookupOffsets=new Uint16Array([1024,1536,1280,1536,0,256,768,512])},{}],5:[function(e,n,t){var r=e("./streams").BrotliInput,i=e("./streams").BrotliOutput,o=e("./bit_reader"),s=e("./dictionary"),f=e("./huffman").HuffmanCode,a=e("./huffman").BrotliBuildHuffmanTable,w=e("./context"),d=e("./prefix"),u=e("./transform"),p=1080,h=new Uint8Array([1,2,3,4,0,5,17,6,16,7,8,9,10,11,12,13,14,15]),c=new Uint8Array([3,2,1,0,3,3,3,3,3,3,2,2,2,2,2,2]),b=new Int8Array([0,0,0,0,-1,1,-2,2,-3,3,-1,1,-2,2,-3,3]),l=new Uint16Array([256,402,436,468,500,534,566,598,630,662,694,726,758,790,822,854,886,920,952,984,1016,1048,1080]);function v(e){var n;return 0===e.readBits(1)?16:(n=e.readBits(3))>0?17+n:(n=e.readBits(3))>0?8+n:17}function y(e){if(e.readBits(1)){var n=e.readBits(3);return 0===n?1:e.readBits(n)+(1<<n)}return 0}function m(){this.meta_block_length=0,this.input_end=0,this.is_uncompressed=0,this.is_metadata=!1}function W(e){var n,t,r,i=new m;if(i.input_end=e.readBits(1),i.input_end&&e.readBits(1))return i;if(7===(n=e.readBits(2)+4)){if(i.is_metadata=!0,0!==e.readBits(1))throw new Error("Invalid reserved bit");if(0===(t=e.readBits(2)))return i;for(r=0;r<t;r++){var o=e.readBits(8);if(r+1===t&&t>1&&0===o)throw new Error("Invalid size byte");i.meta_block_length|=o<<8*r}}else for(r=0;r<n;++r){var s=e.readBits(4);if(r+1===n&&n>4&&0===s)throw new Error("Invalid size nibble");i.meta_block_length|=s<<4*r}return++i.meta_block_length,i.input_end||i.is_metadata||(i.is_uncompressed=e.readBits(1)),i}function x(e,n,t){var r;return t.fillBitWindow(),(r=e[n+=t.val_>>>t.bit_pos_&255].bits-8)>0&&(t.bit_pos_+=8,n+=e[n].value,n+=t.val_>>>t.bit_pos_&(1<<r)-1),t.bit_pos_+=e[n].bits,e[n].value}function U(e,n,t,r){var i,o,s=new Uint8Array(e);if(r.readMoreInput(),1===(o=r.readBits(2))){for(var w=e-1,d=0,u=new Int32Array(4),p=r.readBits(2)+1;w;)w>>=1,++d;for(c=0;c<p;++c)u[c]=r.readBits(d)%e,s[u[c]]=2;switch(s[u[0]]=1,p){case 1:break;case 3:if(u[0]===u[1]||u[0]===u[2]||u[1]===u[2])throw new Error("[ReadHuffmanCode] invalid symbols");break;case 2:if(u[0]===u[1])throw new Error("[ReadHuffmanCode] invalid symbols");s[u[1]]=1;break;case 4:if(u[0]===u[1]||u[0]===u[2]||u[0]===u[3]||u[1]===u[2]||u[1]===u[3]||u[2]===u[3])throw new Error("[ReadHuffmanCode] invalid symbols");r.readBits(1)?(s[u[2]]=3,s[u[3]]=3):s[u[0]]=2}}else{var c,b=new Uint8Array(18),l=32,v=0,y=[new f(2,0),new f(2,4),new f(2,3),new f(3,2),new f(2,0),new f(2,4),new f(2,3),new f(4,1),new f(2,0),new f(2,4),new f(2,3),new f(3,2),new f(2,0),new f(2,4),new f(2,3),new f(4,5)];for(c=o;c<18&&l>0;++c){var m,W=h[c],x=0;r.fillBitWindow(),x+=r.val_>>>r.bit_pos_&15,r.bit_pos_+=y[x].bits,m=y[x].value,b[W]=m,0!==m&&(l-=32>>m,++v)}if(1!==v&&0!==l)throw new Error("[ReadHuffmanCode] invalid num_codes or space");!function(e,n,t,r){for(var i=0,o=8,s=0,w=0,d=32768,u=[],p=0;p<32;p++)u.push(new f(0,0));for(a(u,0,5,e,18);i<n&&d>0;){var h,c=0;if(r.readMoreInput(),r.fillBitWindow(),c+=r.val_>>>r.bit_pos_&31,r.bit_pos_+=u[c].bits,(h=255&u[c].value)<16)s=0,t[i++]=h,0!==h&&(o=h,d-=32768>>h);else{var b,l,v=h-14,y=0;if(16===h&&(y=o),w!==y&&(s=0,w=y),b=s,s>0&&(s-=2,s<<=v),i+(l=(s+=r.readBits(v)+3)-b)>n)throw new Error("[ReadHuffmanCodeLengths] symbol + repeat_delta > num_symbols");for(var m=0;m<l;m++)t[i+m]=w;i+=l,0!==w&&(d-=l<<15-w)}}if(0!==d)throw new Error("[ReadHuffmanCodeLengths] space = "+d);for(;i<n;i++)t[i]=0}(b,e,s,r)}if(0===(i=a(n,t,8,s,e)))throw new Error("[ReadHuffmanCode] BuildHuffmanTable failed: ");return i}function E(e,n,t){var r,i;return r=x(e,n,t),i=d.kBlockLengthPrefixCode[r].nbits,d.kBlockLengthPrefixCode[r].offset+t.readBits(i)}function V(e,n,t){var r;return e<16?(t+=c[e],r=n[t&=3]+b[e]):r=e-16+1,r}function O(e,n){for(var t=e[n],r=n;r;--r)e[r]=e[r-1];e[0]=t}function N(e,n){this.alphabet_size=e,this.num_htrees=n,this.codes=new Array(n+n*l[e+31>>>5]),this.htrees=new Uint32Array(n)}function q(e,n){var t,r,i={num_htrees:null,context_map:null},o=0;n.readMoreInput();var s=i.num_htrees=y(n)+1,a=i.context_map=new Uint8Array(e);if(s<=1)return i;for(n.readBits(1)&&(o=n.readBits(4)+1),t=[],r=0;r<p;r++)t[r]=new f(0,0);for(U(s+o,t,0,n),r=0;r<e;){var w;if(n.readMoreInput(),0===(w=x(t,0,n)))a[r]=0,++r;else if(w<=o)for(var d=1+(1<<w)+n.readBits(w);--d;){if(r>=e)throw new Error("[DecodeContextMap] i >= context_map_size");a[r]=0,++r}else a[r]=w-o,++r}return n.readBits(1)&&function(e,n){var t,r=new Uint8Array(256);for(t=0;t<256;++t)r[t]=t;for(t=0;t<n;++t){var i=e[t];e[t]=r[i],i&&O(r,i)}}(a,e),i}function B(e,n,t,r,i,o,s){var f,a=2*t,w=t,d=x(n,t*p,s);(f=0===d?i[a+(1&o[w])]:1===d?i[a+(o[w]-1&1)]+1:d-2)>=e&&(f-=e),r[t]=f,i[a+(1&o[w])]=f,++o[w]}function Y(e,n,t,r,i,s){var f,a=i+1,w=t&i,d=s.pos_&o.IBUF_MASK;if(n<8||s.bit_pos_+(n<<3)<s.bit_end_pos_)for(;n-- >0;)s.readMoreInput(),r[w++]=s.readBits(8),w===a&&(e.write(r,a),w=0);else{if(s.bit_end_pos_<32)throw new Error("[CopyUncompressedBlockToOutput] br.bit_end_pos_ < 32");for(;s.bit_pos_<32;)r[w]=s.val_>>>s.bit_pos_,s.bit_pos_+=8,++w,--n;if(d+(f=s.bit_end_pos_-s.bit_pos_>>3)>o.IBUF_MASK){for(var u=o.IBUF_MASK+1-d,p=0;p<u;p++)r[w+p]=s.buf_[d+p];f-=u,w+=u,n-=u,d=0}for(p=0;p<f;p++)r[w+p]=s.buf_[d+p];if(n-=f,(w+=f)>=a)for(e.write(r,a),w-=a,p=0;p<w;p++)r[p]=r[a+p];for(;w+n>=a;){if(f=a-w,s.input_.read(r,w,f)<f)throw new Error("[CopyUncompressedBlockToOutput] not enough bytes");e.write(r,a),n-=f,w=0}if(s.input_.read(r,w,n)<n)throw new Error("[CopyUncompressedBlockToOutput] not enough bytes");s.reset()}}function R(e){var n=e.bit_pos_+7&-8;return 0==e.readBits(n-e.bit_pos_)}function H(e){var n=new r(e),t=new o(n);return v(t),W(t).meta_block_length}function M(e,n){var t,r,i,a,h,c,b,l,m,O,H=0,M=0,g=0,A=[16,15,11,4],F=0,Z=0,P=0,k=[new N(0,0),new N(0,0),new N(0,0)],K=128+o.READ_SIZE;i=(1<<(r=v(O=new o(e))))-16,h=(a=1<<r)-1,c=new Uint8Array(a+K+s.maxDictionaryWordLength),b=a,l=[],m=[];for(var X=0;X<3240;X++)l[X]=new f(0,0),m[X]=new f(0,0);for(;!M;){var G,L,J,T,z,D,I,j,C,Q,S,_=0,$=[1<<28,1<<28,1<<28],ee=[0],ne=[1,1,1],te=[0,1,0,1,0,1],re=[0],ie=null,oe=null,se=0,fe=null,ae=0,we=0,de=0;for(t=0;t<3;++t)k[t].codes=null,k[t].htrees=null;O.readMoreInput();var ue=W(O);if(H+(_=ue.meta_block_length)>n.buffer.length){var pe=new Uint8Array(H+_);pe.set(n.buffer),n.buffer=pe}if(M=ue.input_end,G=ue.is_uncompressed,ue.is_metadata)for(R(O);_>0;--_)O.readMoreInput(),O.readBits(8);else if(0!==_)if(G)O.bit_pos_=O.bit_pos_+7&-8,Y(n,_,H,c,h,O),H+=_;else{for(t=0;t<3;++t)ne[t]=y(O)+1,ne[t]>=2&&(U(ne[t]+2,l,t*p,O),U(26,m,t*p,O),$[t]=E(m,t*p,O),re[t]=1);for(O.readMoreInput(),T=(1<<(L=O.readBits(2)))-1,z=(J=16+(O.readBits(4)<<L))+(48<<L),ie=new Uint8Array(ne[0]),t=0;t<ne[0];++t)O.readMoreInput(),ie[t]=O.readBits(2)<<1;var he=q(ne[0]<<6,O);I=he.num_htrees,D=he.context_map;var ce=q(ne[2]<<2,O);for(C=ce.num_htrees,j=ce.context_map,k[0]=new N(256,I),k[1]=new N(704,ne[1]),k[2]=new N(z,C),t=0;t<3;++t)k[t].decode(O);for(oe=0,fe=0,Q=ie[ee[0]],we=w.lookupOffsets[Q],de=w.lookupOffsets[Q+1],S=k[1].htrees[0];_>0;){var be,le,ve,ye,me,We,xe,Ue,Ee,Ve,Oe,Ne;for(O.readMoreInput(),0===$[1]&&(B(ne[1],l,1,ee,te,re,O),$[1]=E(m,p,O),S=k[1].htrees[ee[1]]),--$[1],(le=(be=x(k[1].codes,S,O))>>6)>=2?(le-=2,xe=-1):xe=0,ve=d.kInsertRangeLut[le]+(be>>3&7),ye=d.kCopyRangeLut[le]+(7&be),me=d.kInsertLengthPrefixCode[ve].offset+O.readBits(d.kInsertLengthPrefixCode[ve].nbits),We=d.kCopyLengthPrefixCode[ye].offset+O.readBits(d.kCopyLengthPrefixCode[ye].nbits),Z=c[H-1&h],P=c[H-2&h],Ee=0;Ee<me;++Ee)O.readMoreInput(),0===$[0]&&(B(ne[0],l,0,ee,te,re,O),$[0]=E(m,0,O),oe=ee[0]<<6,Q=ie[ee[0]],we=w.lookupOffsets[Q],de=w.lookupOffsets[Q+1]),se=D[oe+(w.lookup[we+Z]|w.lookup[de+P])],--$[0],P=Z,Z=x(k[0].codes,k[0].htrees[se],O),c[H&h]=Z,(H&h)===h&&n.write(c,a),++H;if((_-=me)<=0)break;if(xe<0&&(O.readMoreInput(),0===$[2]&&(B(ne[2],l,2,ee,te,re,O),$[2]=E(m,2160,O),fe=ee[2]<<2),--$[2],ae=j[fe+(255&(We>4?3:We-2))],(xe=x(k[2].codes,k[2].htrees[ae],O))>=J&&(Ne=(xe-=J)&T,xe=J+((qe=(2+(1&(xe>>=L))<<(Oe=1+(xe>>1)))-4)+O.readBits(Oe)<<L)+Ne)),(Ue=V(xe,A,F))<0)throw new Error("[BrotliDecompress] invalid distance");if(Ve=H&h,Ue>(g=H<i&&g!==i?H:i)){if(!(We>=s.minDictionaryWordLength&&We<=s.maxDictionaryWordLength))throw new Error("Invalid backward reference. pos: "+H+" distance: "+Ue+" len: "+We+" bytes left: "+_);var qe=s.offsetsByLength[We],Be=Ue-g-1,Ye=s.sizeBitsByLength[We],Re=Be>>Ye;if(qe+=(Be&(1<<Ye)-1)*We,!(Re<u.kNumTransforms))throw new Error("Invalid backward reference. pos: "+H+" distance: "+Ue+" len: "+We+" bytes left: "+_);var He=u.transformDictionaryWord(c,Ve,qe,We,Re);if(H+=He,_-=He,(Ve+=He)>=b){n.write(c,a);for(var Me=0;Me<Ve-b;Me++)c[Me]=c[b+Me]}}else{if(xe>0&&(A[3&F]=Ue,++F),We>_)throw new Error("Invalid backward reference. pos: "+H+" distance: "+Ue+" len: "+We+" bytes left: "+_);for(Ee=0;Ee<We;++Ee)c[H&h]=c[H-Ue&h],(H&h)===h&&n.write(c,a),++H,--_}Z=c[H-1&h],P=c[H-2&h]}H&=1073741823}}n.write(c,H&h)}N.prototype.decode=function(e){var n,t=0;for(n=0;n<this.num_htrees;++n)this.htrees[n]=t,t+=U(this.alphabet_size,this.codes,t,e)},t.BrotliDecompressedSize=H,t.BrotliDecompressBuffer=function(e,n){var t=new r(e);null==n&&(n=H(e));var o=new Uint8Array(n),s=new i(o);return M(t,s),s.pos<s.buffer.length&&(s.buffer=s.buffer.subarray(0,s.pos)),s.buffer},t.BrotliDecompress=M,s.init()},{"./bit_reader":3,"./context":4,"./dictionary":8,"./huffman":9,"./prefix":10,"./streams":11,"./transform":12}],6:[function(e,n,t){var r=e("base64-js");t.init=function(){return(0,e("./decode").BrotliDecompressBuffer)(r.toByteArray(e("./dictionary.bin.js")))}},{"./decode":5,"./dictionary.bin.js":7,"base64-js":2}],7:[function(e,n,t){n.exports="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"},{}],8:[function(e,n,t){var r=e("./dictionary-data");t.init=function(){t.dictionary=r.init()},t.offsetsByLength=new Uint32Array([0,0,0,0,0,4096,9216,21504,35840,44032,53248,63488,74752,87040,93696,100864,104704,106752,108928,113536,115968,118528,119872,121280,122016]),t.sizeBitsByLength=new Uint8Array([0,0,0,0,10,10,11,11,10,10,10,10,10,9,9,8,7,7,8,7,7,6,6,5,5]),t.minDictionaryWordLength=4,t.maxDictionaryWordLength=24},{"./dictionary-data":6}],9:[function(e,n,t){function r(e,n){this.bits=e,this.value=n}t.HuffmanCode=r;function i(e,n){for(var t=1<<n-1;e&t;)t>>=1;return(e&t-1)+t}function o(e,n,t,i,o){do{e[n+(i-=t)]=new r(o.bits,o.value)}while(i>0)}function s(e,n,t){for(var r=1<<n-t;n<15&&!((r-=e[n])<=0);)++n,r<<=1;return n-t}t.BrotliBuildHuffmanTable=function(e,n,t,f,a){var w,d,u,p,h,c,b,l,v,y,m=n,W=new Int32Array(16),x=new Int32Array(16);for(y=new Int32Array(a),d=0;d<a;d++)W[f[d]]++;for(x[1]=0,w=1;w<15;w++)x[w+1]=x[w]+W[w];for(d=0;d<a;d++)0!==f[d]&&(y[x[f[d]]++]=d);if(v=l=1<<(b=t),1===x[15]){for(u=0;u<v;++u)e[n+u]=new r(0,65535&y[0]);return v}for(u=0,d=0,w=1,p=2;w<=t;++w,p<<=1)for(;W[w]>0;--W[w])o(e,n+u,p,l,new r(255&w,65535&y[d++])),u=i(u,w);for(c=v-1,h=-1,w=t+1,p=2;w<=15;++w,p<<=1)for(;W[w]>0;--W[w])(u&c)!==h&&(n+=l,v+=l=1<<(b=s(W,w,t)),e[m+(h=u&c)]=new r(b+t&255,n-m-h&65535)),o(e,n+(u>>t),p,l,new r(w-t&255,65535&y[d++])),u=i(u,w);return v}},{}],10:[function(e,n,t){function r(e,n){this.offset=e,this.nbits=n}t.kBlockLengthPrefixCode=[new r(1,2),new r(5,2),new r(9,2),new r(13,2),new r(17,3),new r(25,3),new r(33,3),new r(41,3),new r(49,4),new r(65,4),new r(81,4),new r(97,4),new r(113,5),new r(145,5),new r(177,5),new r(209,5),new r(241,6),new r(305,6),new r(369,7),new r(497,8),new r(753,9),new r(1265,10),new r(2289,11),new r(4337,12),new r(8433,13),new r(16625,24)],t.kInsertLengthPrefixCode=[new r(0,0),new r(1,0),new r(2,0),new r(3,0),new r(4,0),new r(5,0),new r(6,1),new r(8,1),new r(10,2),new r(14,2),new r(18,3),new r(26,3),new r(34,4),new r(50,4),new r(66,5),new r(98,5),new r(130,6),new r(194,7),new r(322,8),new r(578,9),new r(1090,10),new r(2114,12),new r(6210,14),new r(22594,24)],t.kCopyLengthPrefixCode=[new r(2,0),new r(3,0),new r(4,0),new r(5,0),new r(6,0),new r(7,0),new r(8,0),new r(9,0),new r(10,1),new r(12,1),new r(14,2),new r(18,2),new r(22,3),new r(30,3),new r(38,4),new r(54,4),new r(70,5),new r(102,5),new r(134,6),new r(198,7),new r(326,8),new r(582,9),new r(1094,10),new r(2118,24)],t.kInsertRangeLut=[0,0,8,8,0,16,8,16,16],t.kCopyRangeLut=[0,8,0,8,16,0,16,8,16]},{}],11:[function(e,n,t){function r(e){this.buffer=e,this.pos=0}function i(e){this.buffer=e,this.pos=0}r.prototype.read=function(e,n,t){this.pos+t>this.buffer.length&&(t=this.buffer.length-this.pos);for(var r=0;r<t;r++)e[n+r]=this.buffer[this.pos+r];return this.pos+=t,t},t.BrotliInput=r,i.prototype.write=function(e,n){if(this.pos+n>this.buffer.length)throw new Error("Output buffer is not large enough");return this.buffer.set(e.subarray(0,n),this.pos),this.pos+=n,n},t.BrotliOutput=i},{}],12:[function(e,n,t){var r=e("./dictionary"),i=10,o=11;function s(e,n,t){this.prefix=new Uint8Array(e.length),this.transform=n,this.suffix=new Uint8Array(t.length);for(var r=0;r<e.length;r++)this.prefix[r]=e.charCodeAt(r);for(r=0;r<t.length;r++)this.suffix[r]=t.charCodeAt(r)}var f=[new s("",0,""),new s("",0," "),new s(" ",0," "),new s("",12,""),new s("",i," "),new s("",0," the "),new s(" ",0,""),new s("s ",0," "),new s("",0," of "),new s("",i,""),new s("",0," and "),new s("",13,""),new s("",1,""),new s(", ",0," "),new s("",0,", "),new s(" ",i," "),new s("",0," in "),new s("",0," to "),new s("e ",0," "),new s("",0,'"'),new s("",0,"."),new s("",0,'">'),new s("",0,"\n"),new s("",3,""),new s("",0,"]"),new s("",0," for "),new s("",14,""),new s("",2,""),new s("",0," a "),new s("",0," that "),new s(" ",i,""),new s("",0,". "),new s(".",0,""),new s(" ",0,", "),new s("",15,""),new s("",0," with "),new s("",0,"'"),new s("",0," from "),new s("",0," by "),new s("",16,""),new s("",17,""),new s(" the ",0,""),new s("",4,""),new s("",0,". The "),new s("",o,""),new s("",0," on "),new s("",0," as "),new s("",0," is "),new s("",7,""),new s("",1,"ing "),new s("",0,"\n\t"),new s("",0,":"),new s(" ",0,". "),new s("",0,"ed "),new s("",20,""),new s("",18,""),new s("",6,""),new s("",0,"("),new s("",i,", "),new s("",8,""),new s("",0," at "),new s("",0,"ly "),new s(" the ",0," of "),new s("",5,""),new s("",9,""),new s(" ",i,", "),new s("",i,'"'),new s(".",0,"("),new s("",o," "),new s("",i,'">'),new s("",0,'="'),new s(" ",0,"."),new s(".com/",0,""),new s(" the ",0," of the "),new s("",i,"'"),new s("",0,". This "),new s("",0,","),new s(".",0," "),new s("",i,"("),new s("",i,"."),new s("",0," not "),new s(" ",0,'="'),new s("",0,"er "),new s(" ",o," "),new s("",0,"al "),new s(" ",o,""),new s("",0,"='"),new s("",o,'"'),new s("",i,". "),new s(" ",0,"("),new s("",0,"ful "),new s(" ",i,". "),new s("",0,"ive "),new s("",0,"less "),new s("",o,"'"),new s("",0,"est "),new s(" ",i,"."),new s("",o,'">'),new s(" ",0,"='"),new s("",i,","),new s("",0,"ize "),new s("",o,"."),new s("Â ",0,""),new s(" ",0,","),new s("",i,'="'),new s("",o,'="'),new s("",0,"ous "),new s("",o,", "),new s("",i,"='"),new s(" ",i,","),new s(" ",o,'="'),new s(" ",o,", "),new s("",o,","),new s("",o,"("),new s("",o,". "),new s(" ",o,"."),new s("",o,"='"),new s(" ",o,". "),new s(" ",i,'="'),new s(" ",o,"='"),new s(" ",i,"='")];function a(e,n){return e[n]<192?(e[n]>=97&&e[n]<=122&&(e[n]^=32),1):e[n]<224?(e[n+1]^=32,2):(e[n+2]^=5,3)}t.kTransforms=f,t.kNumTransforms=f.length,t.transformDictionaryWord=function(e,n,t,s,w){var d,u=f[w].prefix,p=f[w].suffix,h=f[w].transform,c=h<12?0:h-11,b=0,l=n;c>s&&(c=s);for(var v=0;v<u.length;)e[n++]=u[v++];for(t+=c,s-=c,h<=9&&(s-=h),b=0;b<s;b++)e[n++]=r.dictionary[t+b];if(d=n-s,h===i)a(e,d);else if(h===o)for(;s>0;){var y=a(e,d);d+=y,s-=y}for(var m=0;m<p.length;)e[n++]=p[m++];return n-l}},{"./dictionary":8}],13:[function(e,n,t){n.exports=e("./dec/decode").BrotliDecompressBuffer},{"./dec/decode":5}]},{},[1])(1)});
    }(void 0, void 0, void 0, void 0, void 0));
    return self.DecodeBrotliJson;
  }());
  var compressed = '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';
  if (compressed.length !== 300540 || !/^[A-Za-z0-9+/]+={0,2}$/.test(compressed))
    throw new Error('Invalid embedded sheet data.');
  var decoded = DecodeBrotliJson(compressed);
  if (decoded.length !== 4758970) throw new Error('Invalid embedded sheet data length.');
  var bundle = JSON.parse(decoded);
  var strings = bundle.d || [];
  function expand(value) {
    if (typeof value === 'string' && value.charAt(0) === '')
      return strings[parseInt(value.substring(1), 36)];
    if (Array.isArray(value)) {
      value.forEach(function (item, index) { value[index] = expand(item); });
    } else if (value && typeof value === 'object') {
      Object.keys(value).forEach(function (key) { value[key] = expand(value[key]); });
    }
    return value;
  }
  var packed = expand(bundle.p || bundle);
  var embedded = packed.s || [];
  var sharedModeSets = packed.m || [];
  var serializedModes = sharedModeSets.map(JSON.stringify);
  var serializedRollVisibility = (packed.r || []).map(JSON.stringify);
  var serializedFieldVisibility = (packed.v || []).map(JSON.stringify);
  var serializedFieldAliases = (packed.a || []).map(JSON.stringify);
  embedded.forEach(function (sheet) {
    var modeSets = (sheet.M || []).map(function (index) { return serializedModes[index]; });
    var rollVisibilitySets = (sheet.R || []).map(function (index) { return JSON.parse(serializedRollVisibility[index]); });
    sheet.rolls = (sheet.rolls || []).map(function (roll) {
      var restored = { key: roll[0], name: roll[1] || null, label: roll[2] || '', aliases: roll[3] || [],
        raw: roll[4] || '', template: roll[5] || null, repeating: roll[7] || null,
        staticLabels: roll[8] || [], labelRefs: roll[9] || [], expressionRefs: roll[10] || [],
        modes: roll[13] ? JSON.parse(modeSets[roll[13] - 1]) : [] };
      if (roll[6]) restored.refs = roll[6];
      if (roll[11]) restored.controls = roll[11];
      if (roll[12]) restored.modesIncomplete = true;
      if (roll[14]) restored.visibility = rollVisibilitySets[roll[14] - 1];
      return restored;
    });
    delete sheet.M;
    delete sheet.R;
    var fieldVisibilitySets = (sheet.V || []).map(function (index) { return JSON.parse(serializedFieldVisibility[index]); });
    var fieldAliasSets = (sheet.A || []).map(function (index) { return JSON.parse(serializedFieldAliases[index]); });
    delete sheet.V;
    delete sheet.A;
    var fieldTypes = ['text','number','range','checkbox','radio','hidden','textarea','select'];
    var sections = Object.keys(sheet.sections || {}).sort();
    var repeatingFields = Object.create(null);
    sections.forEach(function (section) {
      (sheet.sections[section] || []).forEach(function (name) { repeatingFields[name] = true; });
    });
    var globalRepeating = sheet.g || [];
    sheet.globalAttributes = (sheet.attributes || []).filter(function (name) {
      return !repeatingFields[name] || globalRepeating.indexOf(name) >= 0;
    });
    delete sheet.g;
    sheet.fields = (sheet.f || []).map(function (field) {
      var flags = Number(field[3]) || 0;
      var restored = { name: sheet.attributes[field[0]], type: fieldTypes[field[1]] || 'text',
        label: field[2] || sheet.attributes[field[0]], aliases: field[4] ? fieldAliasSets[field[4] - 1] : [],
        section: field[5] ? sections[field[5] - 1] : null, default: field[6] || '', max: field[7] || '', onValue: field[8] || '', visibility: field[9] ? fieldVisibilitySets[field[9] - 1] : null, groupLabel: field[10] || '',
        numericCandidate: !!(flags & 1), trackCandidate: !!(flags & 2), readonly: !!(flags & 4),
        disabled: !!(flags & 8), hidden: !!(flags & 16) };
      if (field[11]) restored.defaultVariants = [restored.default].concat(field[11]);
      if (field[12]) restored.radioRange = field[12].slice();
      return restored;
    });
    delete sheet.f;
    if (!KIBSheetContracts.some(function (current) { return current && current.id === sheet.id; }))
      KIBSheetContracts.push(sheet);
  });
}());
/* SCENE_SUITE_SHEET_RECOGNITION_END */

// ===== 사용자 설정 =====
var sheet_helper_setting = {
  enabled: true,
  legacy_commands: true,
  manager_name: '[GM] 시트 헬퍼 관리',
  player_help_name: '[PL] 시트 헬퍼 사용법',
  refresh_delay: 700,
};

(function (api) {
  'use strict';

  var SHEET_NOT_RECOGNIZED = '현재 인식된 시트가 없습니다.';

  var VERSION = '0.6.44';
  var cache = {};
  var attributeObjectCache = {};
  var refreshTimer = null;
  var pendingResults = {};
  var contractIndexCache = {};
  var contractMatchCache = {};
  var contractCatalogCache = null;
  var suppressedAttributeChanges = {};
  var pendingAttributeChanges = {};
  var pendingAttributeOrder = [];
  var attributeChangeTimer = null;

  function own(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function dictionary(source) {
    var result = Object.create(null);
    Object.keys(source || {}).forEach(function (key) { result[key] = source[key]; });
    return result;
  }

  function trim(value) {
    return String(value == null ? '' : value).trim();
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

 function normalize(value) {
    return trim(value)
      .toLowerCase()
      .replace(/[\s_()（）\[\]{}\/\\.\u00b7,:：-]+/g, '');
  }

  function arithmeticValue(expression) {
    var source = trim(expression).replace(/\s+/g, '');
    var tokens = source.match(/floor|ceil|round|min|max|abs|\d+(?:\.\d+)?|[()+\-*/,]/gi) || [];
    if (!source || tokens.join('') !== source || tokens.length > 200) return null;
    var at = 0;
    function primary() {
      var token = tokens[at++];
      if (token === '+' || token === '-') {
        var unary = primary();
        return unary === null ? null : token === '-' ? -unary : unary;
      }
      if (token === '(') {
        var nested = expressionValue();
        if (tokens[at++] !== ')') return null;
        return nested;
      }
      if (/^(?:floor|ceil|round|min|max|abs)$/i.test(token || '')) {
        var name = token.toLowerCase();
        if (tokens[at++] !== '(') return null;
        var args = [expressionValue()];
        while (tokens[at] === ',') { at += 1; args.push(expressionValue()); }
        if (tokens[at++] !== ')' || args.some(function (value) { return value === null; })) return null;
        if ((name === 'min' || name === 'max') && args.length)
          return Math[name].apply(Math, args);
        if (args.length !== 1) return null;
        return Math[name](args[0]);
      }
      return /^\d+(?:\.\d+)?$/.test(token || '') ? Number(token) : null;
    }
    function term() {
      var value = primary();
      while (value !== null && (tokens[at] === '*' || tokens[at] === '/')) {
        var op = tokens[at++];
        var right = primary();
        if (right === null || (op === '/' && right === 0)) return null;
        value = op === '*' ? value * right : value / right;
      }
      return value;
    }
    function expressionValue() {
      var value = term();
      while (value !== null && (tokens[at] === '+' || tokens[at] === '-')) {
        var op = tokens[at++];
        var right = term();
        if (right === null) return null;
        value = op === '+' ? value + right : value - right;
      }
      return value;
    }
    var result = expressionValue();
    return at === tokens.length && result !== null && isFinite(result) ? result : null;
  }

  function resolvedResourceValue(characterId, raw, defaults, rowContext) {
    var source = trim(raw);
    if (/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(source)) {
      var direct = Number(source);
      return { number: direct, text: String(direct) };
    }
    var resolved = resolvedRollExpression(characterId, source,
      rowContext && rowContext.scopes || [], 0, {}, defaults, rowContext);
    if (!resolved)
      return { number: null, text: source.indexOf('@{') > -1 ? '확인 필요' : source };
    if (!/(?:^|[^A-Za-z0-9_])(?:\d*)d\d+(?:[^A-Za-z0-9_]|$)/i.test(resolved)) {
      if (/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(resolved)) {
        var numeric = Number(resolved);
        return { number: numeric, text: String(numeric) };
      }
      var calculated = arithmeticValue(resolved);
      if (calculated !== null) {
        calculated = Math.round(calculated * 100) / 100;
        return { number: calculated, text: String(calculated) };
      }
    }
    return { number: null, text: resolved.indexOf('@{') > -1 ? '확인 필요' : resolved };
  }

  function getAttr(characterId, name, valueType) {
    if (!characterId || !name) return undefined;
    try {
      return getAttrByName(characterId, name, valueType || 'current');
    } catch (err) {
      return undefined;
    }
  }

  function cachedAttrReader(characterId) {
    var values = dictionary();
    return function (name, type) {
      var key = trim(name) + '|' + (type || 'current');
      if (!own(values, key)) values[key] = getAttr(characterId, name, type);
      return values[key];
    };
  }

  function attrObjects(characterId) {
    return (
      findObjs({ _type: 'attribute', _characterid: characterId }) ||
      findObjs({ type: 'attribute', characterid: characterId }) ||
      []
    );
  }

  function characterObjects() {
    return (findObjs({ _type: 'character' }) || findObjs({ type: 'character' }) || [])
      .slice()
      .sort(function (a, b) {
        return trim(a.get('name')).localeCompare(trim(b.get('name')));
      });
  }

  function initState() {
    state.KIBSheetHelper = state.KIBSheetHelper || {};
    var data = state.KIBSheetHelper;
    if (typeof data.managerId !== 'string') data.managerId = '';
    if (typeof data.managerCharacterId !== 'string') data.managerCharacterId = '';
    if (typeof data.managerHash !== 'string') data.managerHash = '';
    if (typeof data.playerHelpId !== 'string') data.playerHelpId = '';
    if (typeof data.playerHelpHash !== 'string') data.playerHelpHash = '';
    if (!/^(?:public|gm|off)$/.test(data.trackingMode || ''))
      data.trackingMode = own(state, 'hide_tracking') && typeof state.hide_tracking === 'boolean'
        ? state.hide_tracking ? 'gm' : 'public'
        : 'gm';
    if (typeof data.trackGmOnly !== 'boolean') data.trackGmOnly = false;
    data.version = VERSION;
    return data;
  }

  function collectRows(characterId, section, fields, objects, knownPrefixes) {
    var prefix = 'repeating_' + section + '_';
    var attributes = objects || attrObjects(characterId);
    var prefixes = Array.isArray(knownPrefixes) ? knownPrefixes.slice().sort(function (left, right) {
      return right.length - left.length;
    }) : null;
    var sortedFields = fields.slice().sort(function (a, b) {
      return b.length - a.length;
    });
    var rows = dictionary();
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name.indexOf(prefix) !== 0) return;
      if (prefixes) {
        var matchedPrefix = '';
        for (var p = 0; p < prefixes.length; p++) {
          if (name.indexOf(prefixes[p]) === 0) { matchedPrefix = prefixes[p]; break; }
        }
        if (matchedPrefix && matchedPrefix !== prefix) return;
      }
      for (var i = 0; i < sortedFields.length; i++) {
        var field = sortedFields[i];
        var suffix = '_' + field;
        if (name.length <= prefix.length + suffix.length) continue;
        if (name.substring(name.length - suffix.length) !== suffix) continue;
        var rowId = name.substring(prefix.length, name.length - suffix.length);
        if (!rows[rowId]) {
          rows[rowId] = { id: rowId, prefix: prefix, values: dictionary(), names: dictionary(), refs: dictionary() };
        }
        rows[rowId].values[field] = attribute.get('current');
        rows[rowId].names[field] = name;
        rows[rowId].refs[field] = name;
        break;
      }
    });
    var orderName = '_reporder_repeating_' + section;
    var orderAttribute = attributes.filter(function (attribute) {
      return trim(attribute.get('name')) === orderName;
    })[0];
    var ordered = trim(orderAttribute && orderAttribute.get('current'))
      .split(',')
      .map(trim)
      .filter(Boolean);
    var orderedRows = dictionary();
    ordered.forEach(function (rowId) { orderedRows[rowId] = true; });
    Object.keys(rows).sort().forEach(function (rowId) {
      if (!orderedRows[rowId]) {
        ordered.push(rowId);
        orderedRows[rowId] = true;
      }
    });
    ordered = ordered.filter(function (rowId) {
      return !!rows[rowId];
    });
    ordered.forEach(function (rowId, index) {
      fields.forEach(function (field) {
        var row = rows[rowId];
        var exactName = prefix + rowId + '_' + field;
        if (!row.names[field]) row.names[field] = exactName;
        if (own(row.values, field)) return;
        var orderedName = prefix + '$' + index + '_' + field;
        var value = getAttr(characterId, orderedName);
        if (value === undefined) return;
        row.values[field] = value;
        row.refs[field] = orderedName;
      });
    });
    return ordered.map(function (rowId) {
      return rows[rowId];
    });
  }

  function sheetContracts() {
    var found = dictionary();
    var result = [];
    if (!Array.isArray(KIBSheetContracts)) return result;
    for (var i = KIBSheetContracts.length - 1; i >= 0; i--) {
      var contract = KIBSheetContracts[i];
      if (!contract || !contract.id || !contract.signature || !Array.isArray(contract.rolls) || found[contract.id]) continue;
      found[contract.id] = true;
      result.unshift(contract);
    }
    return result;
  }

  function registerContract(contract) {
    if (!contract || !contract.id || !contract.signature || !Array.isArray(contract.rolls) ||
      (!contractSignature(contract).entries.length && !(Array.isArray(contract.attributes) && contract.attributes.length)))
      throw new Error('시트 인식 정보 형식이 올바르지 않습니다.');
    var replaced = false;
    KIBSheetContracts = KIBSheetContracts.map(function (current) {
      if (current && current.id === contract.id) {
        replaced = true;
        return contract;
      }
      return current;
    });
    if (!replaced) KIBSheetContracts.push(contract);
    contractCatalogCache = null;
    invalidate();
    return contract;
  }

  function contractSignature(contract) {
    var source = contract && contract.signature;
    var entries = [];
    var minimum = 0;
    var requiredNames = [];
    if (Array.isArray(source)) {
      entries = source;
    } else if (source && typeof source === 'object') {
      var attrs = source.attrs || source.attributes || source.required;
      if (Array.isArray(source.required)) requiredNames = source.required.map(trim);
      if (Array.isArray(attrs)) entries = attrs;
      else {
        Object.keys(source).forEach(function (name) {
          if (/^(?:min|minimum|threshold|attrs|attributes|required)$/i.test(name)) return;
          entries.push({ name: name, weight: source[name] });
        });
      }
      minimum = Number(source.minimum || source.min || source.threshold);
    }
    entries = entries.map(function (entry) {
      if (typeof entry === 'string') return { name: trim(entry), weight: 1, required: requiredNames.indexOf(trim(entry)) > -1 };
      return {
        name: trim(entry && (entry.name || entry.attr || entry.key)),
        weight: Math.max(1, Number(entry && entry.weight) || 1),
        required: !!(entry && entry.required) || requiredNames.indexOf(trim(entry && (entry.name || entry.attr || entry.key))) > -1,
      };
    }).filter(function (entry) { return !!entry.name; });
    var total = entries.reduce(function (sum, entry) { return sum + entry.weight; }, 0);
    if (!(minimum > 0)) minimum = Math.min(total, Math.max(3, Math.ceil(total * 0.6)));
    return { entries: entries, minimum: minimum, total: total };
  }

  function contractDefaultMap(contract) {
    var result = dictionary();
    (contract && contract.fields || []).forEach(function (field) {
      var name = trim(field && field.name);
      if (!name || field.section || !own(field, 'default')) return;
      result[name] = String(field.default == null ? '' : field.default);
    });
    return result;
  }

  function normalizedDefault(value) {
    return trim(value).toLowerCase().replace(/\s+/g, '');
  }

  function sourceDefaultEvidence(characterId, records, savedNames) {
    var scores = records.map(function () { return 0; });
    var blankContradictions = records.map(function () { return 0; });
    var missingContradictions = records.map(function () { return 0; });
    var sourceContradictions = records.map(function () { return 0; });
    var active = records.slice();
    var used = dictionary(),probes = [];
    var reads = typeof getSheetDefaultValue == 'function'?getSheetDefaultValue:cachedAttrReader(characterId);
    var savedUnique = records.map(function () { return 0; });
    Object.keys(savedNames || {}).forEach(function (name) {
      var owners = records.filter(function (record) { return !!record.globalSet[name]; });
      if (owners.length === 1) savedUnique[owners[0].ordinal] += 1;
    });
    function expectedDefault(record, name) {
      return own(record.defaults, name)
        ? 'value:' + normalizedDefault(record.defaults[name])
        : 'missing';
    }
    var available = dictionary();
    records.forEach(function (record) {
      Object.keys(record.defaults || {}).forEach(function (name) { available[name] = true; });
    });
    var defaultNames = Object.keys(available).sort();
    var defaultValues = dictionary();
    var separatingDefaultNames = [];
    defaultNames.forEach(function (name) {
      var firstExpected = '';
      var different = false;
      var hasNonEmpty = false;
      var values = records.map(function (record, index) {
        var expected = expectedDefault(record, name);
        if (!index) firstExpected = expected;
        else if (expected !== firstExpected) different = true;
        if (expected.indexOf('value:') === 0 && expected.length > 6) hasNonEmpty = true;
        return expected;
      });
      defaultValues[name] = values;
      if ((!savedNames || !savedNames[name]) && hasNonEmpty && different)
        separatingDefaultNames.push(name);
    });
    function nextField() {
      if (!active.length) return '';
      if (active.length === 1) {
        for (var only = 0; only < defaultNames.length; only += 1) {
          var confirmation = defaultNames[only];
          if (!used[confirmation] && !(savedNames && savedNames[confirmation]) &&
              own(active[0].defaults || {}, confirmation) &&
              normalizedDefault((active[0].defaults || {})[confirmation])) return confirmation;
        }
        return '';
      }
      var selected = '';
      var selectedSeparation = -1;
      for (var fieldAt = 0; fieldAt < separatingDefaultNames.length; fieldAt += 1) {
        var name = separatingDefaultNames[fieldAt];
        if (used[name]) continue;
        var counts = dictionary();
        var hasNonEmpty = false;
        for (var activeAt = 0; activeAt < active.length; activeAt += 1) {
          var expected = defaultValues[name][active[activeAt].ordinal];
          counts[expected] = (counts[expected] || 0) + 1;
          if (expected.indexOf('value:') === 0 && expected.length > 6) hasNonEmpty = true;
        }
        var groups = Object.keys(counts);
        if (!hasNonEmpty || groups.length < 2) continue;
        var separation = active.length * active.length;
        groups.forEach(function (value) {
          separation -= counts[value] * counts[value];
        });
        if (separation > selectedSeparation) {
          selected = name;
          selectedSeparation = separation;
        }
      }
      return selected;
    }
    for (var attempt = 0; attempt < 48; attempt += 1) {
      var name = nextField();
      if (!name) break;
      used[name] = true;
      var rawActual = reads(name);
      var actual = normalizedDefault(rawActual);
      if (rawActual === undefined || rawActual === null) {
        records.forEach(function (record) {
          var expected = defaultValues[name][record.ordinal];
          if (expected.indexOf('value:') === 0 && expected.length > 6) missingContradictions[record.ordinal] += 1;
        });
        probes.push({ name: name, value: '', matches: [] });
      } else if (!actual) {
        records.forEach(function (record) {
          var expected = defaultValues[name][record.ordinal];
          if (expected.indexOf('value:') === 0 && expected.length > 6) blankContradictions[record.ordinal] += 1;
        });
        probes.push({ name: name, value: actual, matches: [] });
      } else {
        var actualDefault = 'value:' + actual;
        // 현재 원본에 있는 필드를 선언하지 않은 후보는 공통 기본값이 같아도 제외합니다.
        // getAttrByName 대체 경로에는 이전 시트의 저장값이 섞일 수 있습니다.
        if (typeof getSheetDefaultValue === 'function') records.forEach(function (record) {
          if (!record.globalSet[name]) sourceContradictions[record.ordinal] += 1;
          else if (own(record.defaults, name) && normalizedDefault(record.defaults[name]) !== actual &&
              /[&?]\{|\{\{/.test(record.defaults[name] + actual)) {
            // 수치 보정은 중립으로 두되, 서로 다른 원본 굴림/템플릿 조각은 구별합니다.
            var alternatives = [record.defaults[name]];
            (record.contract.fields || []).forEach(function (field) {
              if (!field.section && field.name === name)
                alternatives = alternatives.concat(field.defaultVariants || []);
            });
            alternatives = alternatives.concat(contractOptionValues((record.contract.controls || {})[name]));
            if (!alternatives.some(function (value) { return normalizedDefault(value) === actual; }))
              sourceContradictions[record.ordinal] += 1;
          }
        });
        var matched = records.filter(function (record) {
          return defaultValues[name][record.ordinal] === actualDefault;
        });
        matched.forEach(function (record) {
          scores[record.ordinal] += 1;
        });
        probes.push({ name: name, value: actual, matches: matched.map(function (record) { return record.contract.id; }) });
      }
      var strongest = Math.max.apply(Math, scores);
      var viable = records.filter(function (record) {
        return missingContradictions[record.ordinal] === 0 && sourceContradictions[record.ordinal] === 0;
      });
      var band = viable.filter(function (record) {
        return strongest < 2 || scores[record.ordinal] >= strongest - 2;
      });
      active = band.length ? band : viable.length ? viable : records.slice();
      var leaders = active.filter(function (record) { return scores[record.ordinal] === strongest; });
      var nextScore = active.filter(function (record) { return scores[record.ordinal] < strongest; })
        .reduce(function (maximum, record) { return Math.max(maximum, scores[record.ordinal]); }, 0);
      if (leaders.length === 1 && strongest >= 2 && strongest - nextScore >= 2 &&
          sourceContradictions[leaders[0].ordinal] === 0 &&
          savedUnique[leaders[0].ordinal] >= 2)
        return { record: leaders[0], survivors: active, scores: scores, probes: probes, matched: true };
    }
    var candidates = records.filter(function (record) {
      return missingContradictions[record.ordinal] === 0 && sourceContradictions[record.ordinal] === 0;
    });
    // Only the saved-attribute fallback may lack fields that the sheet declares.
    // An authoritative missing sheet default must keep that candidate excluded.
    if (!candidates.length && typeof getSheetDefaultValue !== 'function') candidates = records.filter(function (record) {
      return sourceContradictions[record.ordinal] === 0;
    });
    if (!candidates.length) return { record: null, survivors: [],
      scores: scores, probes: probes, matched: false };
    var ranked = candidates.sort(function (left, right) {
      return scores[right.ordinal] - scores[left.ordinal] || left.ordinal - right.ordinal;
    });
    var bestScore = ranked.length ? scores[ranked[0].ordinal] : 0;
    var best = ranked.filter(function (record) { return scores[record.ordinal] === bestScore; });
    var runnerScore = ranked[best.length] ? scores[ranked[best.length].ordinal] : 0;
    if (best.length === 1 && bestScore >= 2 && (bestScore - runnerScore >= 2 || ranked.length === 1))
      return { record: best[0], survivors: ranked, scores: scores, probes: probes, matched: true };
    active = ranked.filter(function (record) {
      return scores[record.ordinal] >= Math.max(0, bestScore - 1);
    });
    return { record: null, survivors: active.length ? active : ranked,
      scores: scores, probes: probes, matched: false };
  }

  function roomSourceDefaultEvidence(characters, records, ownersByName) {
    var fallback = { record: null, survivors: records.slice(), scores: records.map(function () { return 0; }), probes: [], matched: false };
    var savedCounts = dictionary();
    (characters || []).forEach(function (character) { savedCounts[character.id] = 0; });
    Object.keys(ownersByName || {}).forEach(function (name) {
      Object.keys(ownersByName[name] || {}).forEach(function (characterId) {
        if (own(savedCounts, characterId)) savedCounts[characterId] += 1;
      });
    });
    var candidates = (characters || []).slice().sort(function (left, right) {
      return savedCounts[left.id] - savedCounts[right.id] ||
        trim(left.get('name')).localeCompare(trim(right.get('name')));
    });
    var character = candidates[0];
    if (!character) return fallback;
    var savedNames = dictionary();
    Object.keys(ownersByName || {}).forEach(function (name) {
      if (ownersByName[name] && ownersByName[name][character.id]) savedNames[name] = true;
    });
    var evidence = sourceDefaultEvidence(character.id, records, savedNames);
    evidence.characterId = character.id;
    return evidence;
  }

  function trieNode() {
    return { next: dictionary(), values: [] };
  }

  function trieAdd(root, value, entry) {
    var node = root;
    for (var i = 0; i < value.length; i += 1) {
      var character = value.charAt(i);
      if (!node.next[character]) node.next[character] = trieNode();
      node = node.next[character];
    }
    node.values.push(entry);
  }

  function triePrefixes(root, value) {
    var node = root;
    var result = [];
    for (var i = 0; i < value.length; i += 1) {
      node = node.next[value.charAt(i)];
      if (!node) break;
      if (node.values.length) result = result.concat(node.values);
    }
    return result;
  }

  function fieldSuffixTrie(fields) {
    var root = trieNode();
    (fields || []).forEach(function (field) {
      var suffix = '_' + field;
      trieAdd(root, suffix.split('').reverse().join(''), field);
    });
    return root;
  }

  function matchedField(root, name, prefixLength) {
    var node = root;
    var found = '';
    for (var i = name.length - 1; i >= prefixLength; i -= 1) {
      node = node.next[name.charAt(i)];
      if (!node) break;
      if (node.values.length) found = node.values[0];
    }
    return found;
  }

  function recognitionCatalog(contracts) {
    if (contractCatalogCache && contractCatalogCache.contracts.length === contracts.length &&
        contractCatalogCache.contracts.every(function (contract, index) { return contract === contracts[index]; }))
      return contractCatalogCache;
    var catalog = { contracts: contracts.slice(), records: [], exact: dictionary(), prefixes: trieNode() };
    function post(name, posting) {
      if (!name) return;
      if (!catalog.exact[name]) catalog.exact[name] = [];
      catalog.exact[name].push(posting);
    }
    contracts.forEach(function (contract, ordinal) {
      var signature = contractSignature(contract);
      var runtime = contractRuntimeIndex(contract);
      var attributes = Array.isArray(contract.attributes) ? contract.attributes.map(trim).filter(Boolean) : [];
      var globalAttributes = (Array.isArray(contract.globalAttributes) ? contract.globalAttributes : attributes)
        .map(trim).filter(Boolean);
      var globalSet = dictionary();
      globalAttributes.forEach(function (name) { globalSet[name] = true; });
      var record = {
        contract: contract,
        ordinal: ordinal,
        signature: signature,
        attributes: attributes,
        globalAttributes: globalAttributes,
        globalSet: globalSet,
        globalCount: Object.keys(globalSet).length,
        defaults: contractDefaultMap(contract),
        required: signature.entries.filter(function (entry) { return entry.required; }).map(function (entry) { return entry.name; }),
      };
      catalog.records.push(record);
      signature.entries.forEach(function (entry) {
        post(entry.name, { record: record, type: 'signature', weight: entry.weight });
      });
      Object.keys(runtime.exact).forEach(function (name) {
        post(name, { record: record, type: signature.total ? 'dependency' : 'source', key: name });
      });
      runtime.prefixes.forEach(function (prefix) {
        var section = runtime.prefixSections[prefix];
        trieAdd(catalog.prefixes, prefix, {
          record: record,
          prefix: prefix,
          section: section,
          fields: fieldSuffixTrie(runtime.sections[section] || []),
        });
      });
    });
    contractCatalogCache = catalog;
    return catalog;
  }

  function inspectContracts(characterId) {
    if (contractMatchCache.__room__) {
      if (characterId) contractMatchCache[characterId] = contractMatchCache.__room__;
      return contractMatchCache.__room__;
    }
    var defaultEvidence = { probes: [], scores: [], matched: false };
    function remember(result) {
      result.attributeCount = persistentTotal;
      result.contractCount = contracts.length;
      contractMatchCache.__room__ = result;
      if (characterId) contractMatchCache[characterId] = result;
      return result;
    }
    var roomCharacters = characterObjects();
    var liveOwners = dictionary();
    roomCharacters.forEach(function (character) { liveOwners[character.id] = true; });
    var attributes = (
      findObjs({ _type: 'attribute' }) ||
      findObjs({ type: 'attribute' }) ||
      []
    ).filter(function (attribute) {
      var owner = trim(attribute.get('_characterid') || attribute.get('characterid'));
      return !!liveOwners[owner];
    });
    var names = dictionary();
    var ownersByName = dictionary();
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (!name) return;
      names[name] = true;
      var owner = trim(attribute.get('_characterid') || attribute.get('characterid'));
      if (!ownersByName[name]) ownersByName[name] = dictionary();
      if (owner) ownersByName[name][owner] = true;
    });
    var contracts = sheetContracts();
    var catalog = recognitionCatalog(contracts);
    defaultEvidence = roomSourceDefaultEvidence(roomCharacters, catalog.records, ownersByName);
    var nameList = Object.keys(names);
    var persistentTotal = nameList.length;
    var repeatingTotal = nameList.filter(function (name) {
      return name.indexOf('repeating_') === 0;
    }).length;
    var stats = catalog.records.map(function () {
      return {
        signatureScore: 0, signatureSeen: dictionary(), sourceSeen: dictionary(),
        repeatingHits: 0, repeatingSections: dictionary(), support: dictionary(),
        uniqueSeen: dictionary(), uniqueOwners: dictionary(),
      };
    });
    var recognizedFieldsByOwner = dictionary();
    var compatibilityByOwner = dictionary();
    var membershipByOwner = dictionary();
    function markSupport(stat, name) {
      Object.keys(ownersByName[name] || {}).forEach(function (owner) { stat.support[owner] = true; });
    }
    function markRecognized(contractsForName, name) {
      var ordinals = Object.keys(contractsForName);
      if (!ordinals.length) return;
      var membership = ordinals.join(',');
      Object.keys(ownersByName[name] || {}).forEach(function (owner) {
        recognizedFieldsByOwner[owner] = (recognizedFieldsByOwner[owner] || 0) + 1;
        if (!compatibilityByOwner[owner]) compatibilityByOwner[owner] = dictionary();
        ordinals.forEach(function (ordinal) {
          compatibilityByOwner[owner][ordinal] = (compatibilityByOwner[owner][ordinal] || 0) + 1;
        });
        if (!membershipByOwner[owner]) membershipByOwner[owner] = dictionary();
        membershipByOwner[owner][membership] = (membershipByOwner[owner][membership] || 0) + 1;
      });
    }
    function markUniqueOwners(stat, name) {
      Object.keys(ownersByName[name] || {}).forEach(function (owner) { stat.uniqueOwners[owner] = true; });
    }
    nameList.forEach(function (name) {
      var exactPostings = catalog.exact[name] || [];
      var exactContracts = dictionary();
      exactPostings.forEach(function (posting) {
        exactContracts[posting.record.ordinal] = true;
        var stat = stats[posting.record.ordinal];
        if (posting.type === 'signature') {
          if (!stat.signatureSeen[name]) {
            stat.signatureSeen[name] = true;
            stat.signatureScore += posting.weight;
            markSupport(stat, name);
          }
        } else if (posting.type === 'source') {
          stat.sourceSeen[posting.key] = true;
          markSupport(stat, name);
        }
      });
      var exactOrdinals = Object.keys(exactContracts);
      if (exactOrdinals.length === 1) {
        var exactStat = stats[Number(exactOrdinals[0])];
        exactStat.uniqueSeen[name] = true;
        markUniqueOwners(exactStat, name);
        markSupport(exactStat, name);
      }
      if (name.indexOf('repeating_') !== 0) {
        markRecognized(exactContracts, name);
        return;
      }
      var matches = triePrefixes(catalog.prefixes, name);
      var seenContracts = dictionary();
      var matchedByContract = dictionary();
      for (var index = matches.length - 1; index >= 0; index -= 1) {
        var match = matches[index];
        var ordinal = match.record.ordinal;
        if (seenContracts[ordinal]) continue;
        var field = matchedField(match.fields, name, match.prefix.length);
        if (!field) continue;
        seenContracts[ordinal] = true;
        var repeatingStat = stats[ordinal];
        repeatingStat.repeatingHits += 1;
        repeatingStat.repeatingSections[match.section] = true;
        markSupport(repeatingStat, name);
        var sourceKey = 'repeating_' + match.section + '_' + field;
        matchedByContract[ordinal] = sourceKey;
        if (!match.record.signature.total) repeatingStat.sourceSeen[sourceKey] = true;
      }
      var repeatingOrdinals = Object.keys(matchedByContract);
      repeatingOrdinals.forEach(function (ordinal) { exactContracts[ordinal] = true; });
      markRecognized(exactContracts, name);
      if (repeatingOrdinals.length === 1) {
        var repeatingOrdinal = Number(repeatingOrdinals[0]);
        stats[repeatingOrdinal].uniqueSeen[matchedByContract[repeatingOrdinal]] = true;
        markUniqueOwners(stats[repeatingOrdinal], name);
      }
    });
    var recognizedOwnerCount = Object.keys(recognizedFieldsByOwner).length;
    var compatibilityVotes = catalog.records.map(function () { return 0; });
    Object.keys(recognizedFieldsByOwner).forEach(function (owner) {
      var total = recognizedFieldsByOwner[owner];
      if (total < 2) return;
      var coverage = compatibilityByOwner[owner] || {};
      var ranked = catalog.records.map(function (record) {
        return { ordinal: record.ordinal, count: coverage[record.ordinal] || 0 };
      }).sort(function (left, right) {
        return right.count - left.count || left.ordinal - right.ordinal;
      });
      var best = ranked[0];
      var runnerUp = ranked[1] || { ordinal: -1, count: 0 };
      if (!best || best.count / total < 0.9 || best.count <= runnerUp.count) return;
      var bestOnly = 0;
      var runnerOnly = 0;
      Object.keys(membershipByOwner[owner] || {}).forEach(function (membership) {
        var members = (',' + membership + ',');
        var count = membershipByOwner[owner][membership];
        var hasBest = members.indexOf(',' + best.ordinal + ',') >= 0;
        var hasRunner = members.indexOf(',' + runnerUp.ordinal + ',') >= 0;
        if (hasBest && !hasRunner) bestOnly += count;
        if (hasRunner && !hasBest) runnerOnly += count;
      });
      var completeFieldAdvantage = total >= 5 && best.count === total && bestOnly >= 1 && runnerOnly === 0;
      if (completeFieldAdvantage || (total >= 5 && bestOnly >= 2 && bestOnly > runnerOnly))
        compatibilityVotes[best.ordinal] += 1;
    });
    var scored = catalog.records.map(function (record) {
      var contract = record.contract;
      var signature = record.signature;
      var stat = stats[record.ordinal];
      var signatureScore = stat.signatureScore;
      var sourceScore = Object.keys(stat.sourceSeen).length;
      var missingRequired = record.required.filter(function (name) { return !stat.signatureSeen[name]; });
      var contractAttributes = record.attributes;
      var repeatingHits = stat.repeatingHits;
      var repeatingSections = stat.repeatingSections;
      var supportCount = Object.keys(stat.support).length;
      var uniqueEvidence = Object.keys(stat.uniqueSeen).length;
      var uniqueOwnerCount = Object.keys(stat.uniqueOwners).length;
      var useSignature = signature.total > 0;
      var score = useSignature ? signatureScore : sourceScore;
      var total = useSignature ? signature.total : contractAttributes.length;
      var minimum = useSignature ? signature.minimum : Math.min(3, total);
      var ratio = total ? score / total : 0;
      var structuralMatch = useSignature || ratio >= 0.6 || (score >= 6 && ratio >= 0.4);
      var repeatingRatio = repeatingTotal ? repeatingHits / repeatingTotal : 1;
      var rankScore = score + repeatingHits * 2 + Object.keys(repeatingSections).length * 3;
      return {
        contract: contract,
        id: contract.id,
        name: contract.name || contract.id,
        score: score,
        ratio: ratio,
        repeatingHits: repeatingHits,
        repeatingTotal: repeatingTotal,
        repeatingRatio: repeatingRatio,
        supportCount: supportCount,
        uniqueEvidence: uniqueEvidence,
        uniqueOwnerCount: uniqueOwnerCount,
        compatibilityOwnerCount: compatibilityVotes[record.ordinal],
        defaultMatchCount: defaultEvidence.scores[record.ordinal] || 0,
        rankScore: rankScore,
        minimum: minimum,
        missingRequired: missingRequired,
        eligible: total > 0 && missingRequired.length === 0 && score >= minimum && structuralMatch,
      };
    }).sort(function (a, b) {
      return b.compatibilityOwnerCount - a.compatibilityOwnerCount ||
        b.supportCount - a.supportCount || b.uniqueEvidence - a.uniqueEvidence || b.rankScore - a.rankScore ||
        b.repeatingHits - a.repeatingHits || b.score - a.score || b.ratio - a.ratio;
    });
    if (defaultEvidence.matched) {
      var match = scored.filter(function (item) {
        return item.id === defaultEvidence.record.contract.id;
      })[0];
      return remember({ status: 'matched', contract: defaultEvidence.record.contract,
        match: match, matches: scored, recognitionReason: 'source-defaults' });
    }
    var sourceSurvivors = dictionary();
    (defaultEvidence.survivors || []).forEach(function (record) { sourceSurvivors[record.contract.id] = true; });
    var sourceSurvivorCount = Object.keys(sourceSurvivors).length;
    var sourceNarrowed = sourceSurvivorCount < catalog.records.length;
    var selection = sourceNarrowed
      ? scored.filter(function (item) { return sourceSurvivors[item.id]; })
      : scored;
    var selectedRecords = dictionary();
    var selectedGlobal = dictionary();
    selection.forEach(function (item) {
      var record = catalog.records.filter(function (record) {
        return record.contract.id === item.id;
      })[0];
      selectedRecords[item.id] = record;
      (record ? record.globalAttributes : []).forEach(function (name) { selectedGlobal[name] = true; });
    });
    var structureVotes = dictionary();
    var structureVoters = 0;
    Object.keys(liveOwners).forEach(function (owner) {
      var observed = dictionary();
      Object.keys(ownersByName).forEach(function (name) {
        if (!ownersByName[name][owner] || name.indexOf('repeating_') === 0 ||
            name.indexOf('_reporder_repeating_') === 0) return;
        if (selectedGlobal[name]) observed[name] = true;
      });
      var observedNames = Object.keys(observed);
      var observedCount = observedNames.length;
      if (observedCount < 5) return;
      var ranked = selection.map(function (item) {
        var record = selectedRecords[item.id];
        var declared = record ? record.globalSet : dictionary();
        var declaredCount = record ? record.globalCount : 0;
        var hits = observedNames.filter(function (name) { return declared[name]; }).length;
        var union = observedCount + declaredCount - hits;
        return {
          id: item.id,
          score: union ? hits / union : 0,
          observedCoverage: hits / observedCount,
          declaredCoverage: declaredCount ? hits / declaredCount : 0,
        };
      }).sort(function (left, right) { return right.score - left.score; });
      var bestStructure = ranked[0];
      var runnerStructure = ranked[1] || { score: 0 };
      if (!bestStructure || bestStructure.score < 0.9 || bestStructure.observedCoverage < 0.9 ||
          bestStructure.declaredCoverage < 0.9 || bestStructure.score - runnerStructure.score < 0.05) return;
      structureVotes[bestStructure.id] = (structureVotes[bestStructure.id] || 0) + 1;
      structureVoters += 1;
    });
    var structureWinner = selection.filter(function (item) {
      return (structureVotes[item.id] || 0) * 2 > structureVoters;
    });
    if (structureVoters && structureWinner.length === 1)
      return remember({ status: 'matched', contract: structureWinner[0].contract,
        match: structureWinner[0], matches: selection, recognitionReason: 'stored-structure' });
    var compatibilityWinner = selection.filter(function (item) {
      return item.compatibilityOwnerCount * 2 > recognizedOwnerCount;
    });
    if (compatibilityWinner.length === 1)
      return remember({ status: 'matched', contract: compatibilityWinner[0].contract,
        match: compatibilityWinner[0], matches: selection, recognitionReason: 'stored-attributes' });
    var eligible = selection.filter(function (item) { return item.eligible; });
    if (!eligible.length) {
      if (!selection.length) return remember({ status: 'none', contract: null, matches: [],
        recognitionReason: contracts.length ? 'conflicting-source-fields' : 'no-contracts' });
      var evidence = selection[0];
      var runnerUp = selection[1];
      if (!sourceNarrowed && evidence.uniqueEvidence >= 2 && (!runnerUp ||
          evidence.supportCount > runnerUp.supportCount || runnerUp.uniqueEvidence === 0) &&
          evidence.uniqueOwnerCount * 2 > recognizedOwnerCount)
        return remember({ status: 'matched', contract: evidence.contract, match: evidence, matches: selection,
          recognitionReason: 'stored-unique-attributes' });
      return remember({
        status: 'ambiguous', contract: null, matches: selection,
        error: SHEET_NOT_RECOGNIZED,
        recognitionReason: sourceNarrowed
          ? 'source-defaults-ambiguous'
          : persistentTotal ? 'insufficient-or-conflicting-evidence' : 'no-saved-attributes-or-default-match',
      });
    }
    var best = eligible[0];
    if (best.supportCount * 2 <= recognizedOwnerCount) {
      return remember({ status: 'ambiguous', contract: null, matches: selection, error: SHEET_NOT_RECOGNIZED,
        recognitionReason: sourceNarrowed
          ? 'source-defaults-ambiguous' : 'insufficient-room-support' });
    }
    var close = eligible.filter(function (item) {
      return item.supportCount === best.supportCount && best.rankScore - item.rankScore <= 2 &&
        best.ratio - item.ratio < 0.1 && Math.abs(best.repeatingHits - item.repeatingHits) <= 1;
    });
    if (close.length === 1)
      return remember({ status: 'matched', contract: best.contract, match: best, matches: selection,
        recognitionReason: 'stored-signature' });
    return remember({ status: 'ambiguous', contract: null, matches: close, error: SHEET_NOT_RECOGNIZED,
      recognitionReason: sourceNarrowed
        ? 'source-defaults-ambiguous' : 'conflicting-candidates' });
  }

  function usableContractInspection(inspection) {
    return !!inspection && (inspection.status === 'matched' ||
      (inspection.status === 'ambiguous' && inspection.recognitionReason === 'source-defaults-ambiguous'));
  }

  function sourceCandidateInspections(inspection) {
    if (!usableContractInspection(inspection)) return [];
    if (inspection.status === 'matched') return [inspection];
    return (inspection.matches || []).map(function (match) {
      return { status: 'matched', contract: match.contract, match: match, matches: inspection.matches };
    });
  }

  function contractControlList(source) {
    if (Array.isArray(source)) return source;
    if (!source || typeof source !== 'object') return [];
    return Object.keys(source).map(function (name) {
      var value = source[name];
      if (value && typeof value === 'object' && !Array.isArray(value))
        return merge({ name: name }, value);
      return { name: name, options: Array.isArray(value) ? value : [value] };
    });
  }

  function contractControls(contract, roll) {
    var controls = contractControlList(contract && contract.controls);
    contractControlList(roll && roll.controls).forEach(function (local) {
      var name = trim(local && (local.name || local.attr || local.key));
      controls = controls.filter(function (control) {
        return trim(control && (control.name || control.attr || control.key)) !== name;
      });
      controls.push(local);
    });
    return controls;
  }

  function contractControlName(control) {
    return trim(control && (control.name || control.attr || control.key));
  }

  function contractVisibilityResult(condition, valueReader) {
    if (!condition || typeof condition !== 'object') return null;
    if (condition.never === true) return false;
    if (Array.isArray(condition.all)) {
      if (!condition.all.length) return null;
      var allUnknown = false;
      for (var allIndex = 0; allIndex < condition.all.length; allIndex += 1) {
        var allValue = contractVisibilityResult(condition.all[allIndex], valueReader);
        if (allValue === false) return false;
        if (allValue === null) allUnknown = true;
      }
      return allUnknown ? null : true;
    }
    if (Array.isArray(condition.any)) {
      if (!condition.any.length) return null;
      var anyUnknown = false;
      for (var anyIndex = 0; anyIndex < condition.any.length; anyIndex += 1) {
        var anyValue = contractVisibilityResult(condition.any[anyIndex], valueReader);
        if (anyValue === true) return true;
        if (anyValue === null) anyUnknown = true;
      }
      return anyUnknown ? null : false;
    }
    if (condition.not) {
      var negated = contractVisibilityResult(condition.not, valueReader);
      return negated === null ? null : !negated;
    }
    var name = trim(condition.name);
    var op = trim(condition.op).toLowerCase();
    if (!name || !op || typeof valueReader !== 'function') return null;
    var resolved = valueReader(name, condition);
    if (!resolved || resolved.known !== true) return null;
    var actual = String(resolved.value == null ? '' : resolved.value);
    var expected = String(condition.value == null ? '' : condition.value);
    var matched;
    if (op === 'eq' || op === 'not-eq' || op === 'neq') matched = actual === expected;
    else if (op === 'starts' || op === 'not-starts') matched = actual.indexOf(expected) === 0;
    else if (op === 'ends' || op === 'not-ends') matched = expected === '' || actual.slice(actual.length - expected.length) === expected;
    else if (op === 'contains' || op === 'not-contains') matched = actual.indexOf(expected) > -1;
    else if (op === 'token' || op === 'not-token') matched = actual.split(/\s+/).indexOf(expected) > -1;
    else if (op === 'dash' || op === 'not-dash') matched = actual === expected || actual.indexOf(expected + '-') === 0;
    else return null;
    return op.indexOf('not-') === 0 || op === 'neq' ? !matched : matched;
  }

  function contractVisibilityNames(condition, found) {
    found = found || dictionary();
    if (!condition || typeof condition !== 'object') return found;
    if (Array.isArray(condition)) {
      condition.forEach(function (item) { contractVisibilityNames(item, found); });
      return found;
    }
    if (condition.name) found[trim(condition.name)] = true;
    ['all', 'any', 'not'].forEach(function (key) { contractVisibilityNames(condition[key], found); });
    return found;
  }

  function contractOptionValues(control) {
    var source = control && (control.options || control.values);
    if (!Array.isArray(source) && source && typeof source === 'object') {
      source = Object.keys(source).map(function (key) {
        var option = source[key];
        return option && typeof option === 'object' ? option : { label: key, value: option };
      });
    }
    return (Array.isArray(source) ? source : []).map(function (option) {
      return String(option && typeof option === 'object' && own(option, 'value') ? option.value : option);
    });
  }

  function contractOverrides(mode) {
    var source = mode && mode.overrides;
    var result = dictionary();
    if (Array.isArray(source)) {
      source.forEach(function (entry) {
        var name = trim(entry && (entry.name || entry.attr || entry.key));
        if (name && own(entry, 'value')) result[name] = String(entry.value);
      });
    } else if (source && typeof source === 'object') {
      Object.keys(source).forEach(function (name) { result[name] = String(source[name]); });
    }
    return result;
  }

  function contractQueries(mode) {
    var source = mode && mode.queries;
    var result = [];
    if (Array.isArray(source)) result = source;
    else if (source && typeof source === 'object') {
      result = Object.keys(source).map(function (name) {
        var entry = source[name];
        return entry && typeof entry === 'object'
          ? merge({ name: name }, entry)
          : { name: name, value: entry };
      });
    }
    return result.map(function (entry) {
      var name = trim(entry && (entry.name || entry.label || entry.key));
      var duplicate = name.match(/#(\d+)$/);
      return {
        name: duplicate ? trim(name.substring(0, duplicate.index)) : name,
        occurrence: duplicate ? Number(duplicate[1]) : 1,
        raw: String(entry && (entry.raw || entry.query || entry.token) || ''),
        value: String(entry && own(entry, 'value') ? entry.value : ''),
      };
    }).filter(function (entry) { return entry.raw || entry.name; });
  }

  function contractOverridesValid(contract, roll, mode) {
    var controls = contractControls(contract, roll);
    var overrides = contractOverrides(mode);
    return Object.keys(overrides).every(function (name) {
      var control = controls.filter(function (candidate) {
        return contractControlName(candidate) === name;
      })[0];
      return !!control && contractOptionValues(control).indexOf(String(overrides[name])) > -1;
    });
  }

  function contractRefName(ref) {
    return trim(typeof ref === 'string' ? ref : ref && (ref.name || ref.attr || ref.key));
  }

  function contractRepeating(roll) {
    var source = roll && roll.repeating;
    if (!source) return null;
    function sectionName(value) { return trim(value).replace(/^repeating_/i, ''); }
    if (typeof source === 'string') return { section: sectionName(source), fields: [], source: trim(source) };
    return {
      section: sectionName(source.section || source.name),
      fields: Array.isArray(source.fields) ? source.fields.map(contractRefName).filter(Boolean) : [],
      source: trim(source.section || source.name),
    };
  }

  function contractSections(contract) {
    var source = contract && contract.sections;
    var sections = dictionary();
    if (!source || typeof source !== 'object' || Array.isArray(source)) return sections;
    Object.keys(source).forEach(function (section) {
      var name = trim(section).replace(/^repeating_/i, '');
      var fields = Array.isArray(source[section]) ? source[section].map(contractRefName).filter(Boolean) : [];
      if (name && fields.length) sections[name] = fields;
    });
    return sections;
  }

  function contractRollFields(contract, roll, controlMap) {
    var repeating = contractRepeating(roll);
    if (!repeating) return [];
    var fields = repeating.fields.slice();
    [roll.refs, roll.labelRefs, roll.expressionRefs].forEach(function (refs) {
      (Array.isArray(refs) ? refs : []).forEach(function (ref) {
        var name = contractRefName(ref);
        var rowLocal = typeof ref === 'object' && (ref.row === true || ref.repeating === true || ref.scope === 'row');
        var control = controlMap && controlMap[name];
        if (!control) control = contractControls(contract, roll).filter(function (candidate) {
          return contractControlName(candidate) === name;
        })[0];
        var controlSection = trim(control && control.repeating).replace(/^repeating_/i, '');
        if (name && (rowLocal || controlSection === repeating.section) && fields.indexOf(name) < 0) fields.push(name);
      });
    });
    return fields;
  }

  function contractRowAttr(contract, roll, row, name) {
    if (!row) return name;
    var index = contractRuntimeIndex(contract);
    var fields = index.rollFields[roll.key] || contractRollFields(contract, roll, index.controls);
    return fields.indexOf(name) > -1 ? (row.refs[name] || row.names[name] || name) : name;
  }

  function contractLabelRef(characterId, contract, roll, row, ref, reader) {
    var name = contractRefName(ref);
    if (!name) return '';
    var fullName = contractRowAttr(contract, roll, row, name);
    var value = reader
      ? reader(fullName, ref && ref.max ? 'max' : 'current')
      : getAttr(characterId, fullName, ref && ref.max ? 'max' : 'current');
    var index = contractRuntimeIndex(contract);
    var repeating = contractRepeating(roll);
    var field = repeating && index.fieldSections[repeating.section] && index.fieldSections[repeating.section][name] ||
      index.fieldGlobal[name];
    return trim(field && field.defaultVariants
      ? contractUnsavedFieldValue(field, value, field.default, ref && ref.max) : value);
  }

  function contractStaticLabels(roll) {
    var source = roll && roll.staticLabels;
    return (Array.isArray(source) ? source : source ? [source] : []).map(function (entry) {
      return trim(entry && typeof entry === 'object' ? entry.value : entry);
    }).filter(Boolean);
  }

  function contractModeLabels(mode) {
    var labels = [mode && mode.label].concat(mode && mode.aliases || []);
    var path = mode && mode.labelPath;
    if (Array.isArray(path)) {
      if (path.length) labels.push(path.join(' '));
      labels = labels.concat(path.slice().reverse());
    } else if (path) {
      labels.push(path);
      labels = labels.concat(String(path).split(/\s*(?:>|\/|\||::)\s*/));
    }
    labels.push(mode && mode.id);
    var found = dictionary();
    return labels.map(trim).filter(function (label) {
      var key = normalize(label);
      if (!key || found[key]) return false;
      found[key] = true;
      return true;
    });
  }

  function contractUserModeLabels(mode) {
    var internalId = normalize(mode && mode.id);
    return contractModeLabels(mode).filter(function (label) {
      var key = normalize(label);
      return key && key !== internalId && !/^mode-?[a-f0-9]{8,}$/i.test(key) &&
        humanContractLabel(label) && !/[?@%&]\{|\{\{|\[\[/.test(label);
    });
  }

  function contractRuntimeIndex(contract) {
    var key = String(contract.id) + '|' + String(contract.sourceHash || '') + '|' + contract.rolls.length;
    var cached = contractIndexCache[key];
    if (cached && cached.contract === contract) return cached;
    var index = {
      contract: contract,
      controls: dictionary(),
      exact: dictionary(),
      prefixes: [],
      prefixSections: dictionary(),
      sections: dictionary(),
      rollFields: dictionary(),
      rollControls: dictionary(),
      rollsByKey: dictionary(),
      labelRefFrequency: dictionary(),
      fieldGlobal: dictionary(),
      fieldSections: dictionary(),
      fieldPrefixes: trieNode(),
      presentationControls: dictionary(),
      presentationRollGates: dictionary(),
      rollVisibilityReach: dictionary(),
    };
    var visibilityReach = dictionary();
    var visibilityConditions = [];
    var visibilityNames = [];
    var rollVisibilityPolarity = dictionary();
    var valueReferences = dictionary();
    function countVisibility(condition) {
      if (!condition) return;
      var index = visibilityConditions.indexOf(condition);
      if (index < 0) {
        index = visibilityConditions.length;
        visibilityConditions.push(condition);
        visibilityNames.push(Object.keys(contractVisibilityNames(condition)));
      }
      visibilityNames[index].forEach(function (name) {
        visibilityReach[name] = (visibilityReach[name] || 0) + 1;
      });
    }
    function countRollVisibility(condition, negated) {
      if (!condition || typeof condition !== 'object') return;
      if (Array.isArray(condition)) {
        condition.forEach(function (item) { countRollVisibility(item, negated); });
        return;
      }
      if (condition.not) countRollVisibility(condition.not, !negated);
      if (condition.name && condition.op) {
        var name = trim(condition.name);
        var op = trim(condition.op).toLowerCase();
        var negative = op.indexOf('not-') === 0 || op === 'neq';
        var polarity = negative !== !!negated ? 'negative' : 'positive';
        if (!rollVisibilityPolarity[name])
          rollVisibilityPolarity[name] = {
            positive: false,
            negative: false,
            positiveValues: dictionary(),
            positiveEqualityOnly: true,
          };
        rollVisibilityPolarity[name][polarity] = true;
        if (polarity === 'positive') {
          rollVisibilityPolarity[name].positiveEqualityOnly =
            rollVisibilityPolarity[name].positiveEqualityOnly && op === 'eq';
          if (own(condition, 'value'))
            rollVisibilityPolarity[name].positiveValues[String(condition.value)] = true;
        }
      }
      ['all', 'any'].forEach(function (key) { countRollVisibility(condition[key], negated); });
    }
    (Array.isArray(contract.fields) ? contract.fields : []).forEach(function (field) {
      if (!field || !trim(field.name)) return;
      if (!field.section) {
        index.fieldGlobal[trim(field.name)] = field;
        index.exact[trim(field.name)] = true;
      }
      else {
        var section = trim(field.section).replace(/^repeating_/i, '');
        if (!index.fieldSections[section]) index.fieldSections[section] = dictionary();
        index.fieldSections[section][trim(field.name)] = field;
      }
    });
    (Array.isArray(contract.fields) ? contract.fields : []).forEach(function (field) {
      if (!field || !trim(field.name)) return;
      function addDependency(name, scope) {
        name = trim(name);
        if (!name) return;
        var section = trim(field.section).replace(/^repeating_/i, '');
        if (section && scope !== 'global' && index.fieldSections[section] && index.fieldSections[section][name]) return;
        index.exact[name] = true;
      }
      [field.default, field.max].forEach(function (source) {
        String(source == null ? '' : source).replace(/@\{([^{}|]+)(?:\|max)?\}/g, function (token, name) {
          valueReferences[trim(name)] = true;
          addDependency(name, '');
          return token;
        });
      });
      (function visit(condition) {
        if (!condition || typeof condition !== 'object') return;
        if (Array.isArray(condition)) {
          condition.forEach(visit);
          return;
        }
        if (condition.name) addDependency(condition.name, trim(condition.scope).toLowerCase());
        ['all', 'any', 'not'].forEach(function (key) { visit(condition[key]); });
      })(field.visibility);
      countVisibility(field.visibility);
    });
    Object.keys(index.fieldSections).forEach(function (section) {
      var prefix = 'repeating_' + section + '_';
      trieAdd(index.fieldPrefixes, prefix, {
        prefix: prefix,
        section: section,
        fields: fieldSuffixTrie(Object.keys(index.fieldSections[section])),
      });
    });
    contractControls(contract).forEach(function (control) {
      var name = contractControlName(control);
      if (name) {
        index.controls[name] = control;
        index.exact[name] = true;
      }
    });
    var exactAttributes = Array.isArray(contract.globalAttributes) ? contract.globalAttributes : contract.attributes;
    (Array.isArray(exactAttributes) ? exactAttributes : []).forEach(function (name) {
      name = trim(name);
      if (name) index.exact[name] = true;
    });
    contractSignature(contract).entries.forEach(function (entry) { index.exact[entry.name] = true; });
    var declaredSections = contractSections(contract);
    Object.keys(declaredSections).forEach(function (section) {
      index.sections[section] = declaredSections[section].slice();
      index.prefixes.push('repeating_' + section + '_');
      index.exact['_reporder_repeating_' + section] = true;
    });
    contract.rolls.forEach(function (roll) {
      if (!roll) return;
      var rollKey = String(roll.key);
      if (!own(index.rollsByKey, rollKey)) index.rollsByKey[rollKey] = roll;
      countVisibility(roll.visibility);
      countRollVisibility(roll.visibility, false);
      Object.keys(contractVisibilityNames(roll.visibility)).forEach(function (name) {
        index.rollVisibilityReach[name] = (index.rollVisibilityReach[name] || 0) + 1;
      });
      var scopedControls = dictionary();
      contractControls(contract, roll).forEach(function (control) {
        var name = contractControlName(control);
        if (name) scopedControls[name] = control;
      });
      var repeating = contractRepeating(roll);
      var fields = repeating ? contractRollFields(contract, roll, scopedControls) : [];
      function addExact(name) {
        if (name && (!repeating || fields.indexOf(name) < 0)) index.exact[name] = true;
      }
      (Array.isArray(roll.labelRefs) ? roll.labelRefs : []).forEach(function (ref) {
        var name = contractRefName(ref);
        if (name) index.labelRefFrequency[name] = (index.labelRefFrequency[name] || 0) + 1;
      });
      [roll.refs, roll.labelRefs, roll.expressionRefs].forEach(function (refs) {
        (Array.isArray(refs) ? refs : []).forEach(function (ref) {
          var name = contractRefName(ref);
          if (name) valueReferences[name] = true;
          addExact(name);
        });
      });
      (roll.modes || []).forEach(function (mode) {
        Object.keys(mode && mode.overrides || {}).forEach(function (name) { valueReferences[name] = true; });
      });
      Object.keys(scopedControls).forEach(function (name) {
        addExact(name);
      });
      index.rollControls[roll.key] = scopedControls;
      if (!repeating || !repeating.section) return;
      if (!index.sections[repeating.section]) {
        index.sections[repeating.section] = [];
        index.prefixes.push('repeating_' + repeating.section + '_');
        index.exact['_reporder_repeating_' + repeating.section] = true;
      }
      index.rollFields[roll.key] = fields;
      fields.forEach(function (field) {
        if (index.sections[repeating.section].indexOf(field) < 0) index.sections[repeating.section].push(field);
      });
    });
    (Array.isArray(contract.fields) ? contract.fields : []).forEach(function (field) {
      if (!field || field.section || !/^(?:checkbox|radio)$/i.test(trim(field.type))) return;
      if ((visibilityReach[field.name] || 0) > 1 && !valueReferences[field.name])
        index.presentationControls[field.name] = true;
    });
    Object.keys(index.presentationControls).forEach(function (name) {
      var polarity = rollVisibilityPolarity[name];
      var field = index.fieldGlobal[name];
      var positiveValues = polarity ? Object.keys(polarity.positiveValues || {}) : [];
      var onValue = field && own(field, 'onValue') ? String(field.onValue) : '';
      var positiveCollapsedPanel = polarity && polarity.positive && !polarity.negative &&
        polarity.positiveEqualityOnly && positiveValues.length === 1 &&
        (index.rollVisibilityReach[name] || 0) * 2 > contract.rolls.length &&
        field && trim(field.default) === '' && onValue !== '' && positiveValues[0] === onValue;
      if ((polarity && polarity.negative && !polarity.positive &&
          (index.rollVisibilityReach[name] || 0) * 2 > contract.rolls.length) ||
          positiveCollapsedPanel)
        index.presentationRollGates[name] = true;
    });
    Object.keys(index.fieldSections).forEach(function (section) {
      if (!index.sections[section]) index.sections[section] = [];
      Object.keys(index.fieldSections[section]).forEach(function (field) {
        if (index.sections[section].indexOf(field) < 0) index.sections[section].push(field);
      });
      var prefix = 'repeating_' + section + '_';
      if (index.prefixes.indexOf(prefix) < 0) index.prefixes.push(prefix);
      index.exact['_reporder_repeating_' + section] = true;
    });
    var sectionCounts = dictionary();
    Object.keys(index.sections).forEach(function (section) {
      index.sections[section].sort(function (left, right) { return right.length - left.length; });
      index.prefixSections['repeating_' + section + '_'] = section;
      var folded = section.toLowerCase();
      sectionCounts[folded] = (sectionCounts[folded] || 0) + 1;
    });
    Object.keys(index.sections).forEach(function (section) {
      var folded = section.toLowerCase();
      var prefix = 'repeating_' + folded + '_';
      if (section === folded || sectionCounts[folded] !== 1 || own(index.prefixSections, prefix)) return;
      index.prefixSections[prefix] = section;
      index.prefixes.push(prefix);
      index.exact['_reporder_repeating_' + folded] = true;
      if (index.fieldSections[section]) trieAdd(index.fieldPrefixes, prefix, {
        prefix: prefix,
        section: section,
        fields: fieldSuffixTrie(Object.keys(index.fieldSections[section])),
      });
    });
    index.prefixes.sort(function (left, right) { return right.length - left.length; });
    contractIndexCache[key] = index;
    return index;
  }

  function humanContractLabel(value) {
    var label = trim(value);
    return !!label && label.length <= 100 &&
      !!label.replace(/[\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+/g, '') &&
      !/^(?:true|false|on|off|null|none)$/i.test(label);
  }

  function contractDisplayLabel(value) {
    var label = trim(value).replace(/^븿\s*/, '');
    if (!humanContractLabel(label)) return '';
    if (/^[\d.,%()+\-*/]+$/.test(label) || /^\d*d\d+(?:[+\-*/]\d+(?:\.\d+)?)?$/i.test(label)) return '';
    if (/^mode-?[a-f0-9]{8,}$/i.test(label) || /^roll-?[a-f0-9]{8,}$/i.test(label) ||
      /^repeating_[^.]+\.roll-?[a-f0-9]{8,}$/i.test(label) ||
      /^[A-Za-z0-9_$-]+_(?:check|roll|attack|damage|u)$/i.test(label)) return '';
    return label;
  }

  function contractRolls(characterId, inspection, objects, includeHidden, readLive) {
    inspection = inspection || inspectContracts(characterId, objects);
    if (!inspection || inspection.status !== 'matched') return [];
    var contract = inspection.contract;
    var attributes = objects || attrObjects(characterId);
    var index = contractRuntimeIndex(contract);
    var attributeValues = dictionary();
    var readCache = dictionary();
    readLive = readLive || cachedAttrReader(characterId);
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name) attributeValues[name] = { current: attribute.get('current'), max: attribute.get('max') };
    });
    function read(name, type) {
      var key = name + '|' + type;
      if (own(readCache, key)) return readCache[key];
      if (attributeValues[name]) readCache[key] = attributeValues[name][type];
      else readCache[key] = readLive(name, type);
      return readCache[key];
    }
    var rowsBySection = dictionary();
    Object.keys(index.sections).forEach(function (sectionName) {
      var sourcePrefix = 'repeating_' + sectionName + '_';
      var prefixes = [sourcePrefix].concat(index.prefixes.filter(function (prefix) {
        return prefix !== sourcePrefix && index.prefixSections[prefix] === sectionName;
      }));
      var rows = [];
      prefixes.forEach(function (prefix) {
        var physicalSection = prefix.substring(10, prefix.length - 1);
        rows = rows.concat(collectRows(characterId, physicalSection, index.sections[sectionName], attributes, index.prefixes));
      });
      var rowPrefixes = dictionary();
      var conflicts = dictionary();
      rows.forEach(function (row) {
        if (own(rowPrefixes, row.id) && rowPrefixes[row.id] !== row.prefix) conflicts[row.id] = true;
        rowPrefixes[row.id] = row.prefix;
      });
      // 실행 주소에는 prefix가 없으므로 서로 다른 물리 그룹의 같은 ID는 선택하지 않습니다.
      rowsBySection[sectionName] = rows.filter(function (row) { return !conflicts[row.id]; });
    });
    var character = getObj('character', characterId);
    var characterName = normalize(character && character.get('name'));
    var result = [];
    contract.rolls.forEach(function (roll) {
      if (!roll || !roll.key || !roll.raw) return;
      if (roll.visibility && roll.visibility.never === true) return;
      var repeating = contractRepeating(roll);
      var rows = repeating && repeating.section
        ? rowsBySection[repeating.section] || []
        : [null];
      rows.forEach(function (row) {
        var scopedControls = index.rollControls[roll.key] || dictionary();
        function readVisibility(name, atom) {
          if (index.presentationRollGates[name] && !atom.required) return { known: false };
          var scope = trim(atom && atom.scope).toLowerCase();
          if (scope === 'row' && !row) return { known: false };
          var fullName = scope === 'global' ? name : contractRowAttr(contract, roll, row, name);
          var control = scope === 'global' ? index.controls[name] : scopedControls[name] || index.controls[name];
          var hasValue = own(attributeValues, fullName);
          var liveValue = hasValue ? attributeValues[fullName].current : read(fullName, 'current');
          hasValue = hasValue || liveValue !== undefined && liveValue !== null && String(liveValue) !== '';
          if (hasValue) {
            var options = contractOptionValues(control);
            var validatesOptions = options.length > 1 ||
              /^(?:select|radio)$/i.test(trim(control && control.type));
            if (!validatesOptions || !options.length || options.indexOf(String(liveValue)) > -1)
              return { known: true, value: liveValue };
            return control && own(control, 'default')
              ? { known: true, value: control.default }
              : { known: false };
          }
          return control && own(control, 'default')
            ? { known: true, value: control.default }
            : { known: false };
        }
        var visibility = contractVisibilityResult(roll.visibility, readVisibility);
        // Explicit bonus/private modes may use hidden dice buttons, never an inactive worker panel.
        if (contractVisibilityResult(roll.visibility, function (name, atom) {
          return atom.required ? readVisibility(name, atom) : { known: false };
        }) === false) return;
        if (visibility === false && !includeHidden) return;
        var rawVisible = trim(roll.label);
        var visible = contractDisplayLabel(rawVisible);
        if (visible && roll.name && normalize(visible) === normalize(roll.name)) visible = '';
        var staticLabels = contractStaticLabels(roll);
        if (!visible && rawVisible && !repeating) {
          var sourceGroups = dictionary();
          String(roll.raw || '').replace(/@\{([^{}|]+)(?:\|max)?\}/g, function (match, name) {
            var field = index.fieldGlobal[name];
            var group = contractDisplayLabel(field && field.numericCandidate ? field.groupLabel : '');
            if (group) sourceGroups[normalize(group)] = group;
            return match;
          });
          var sourceGroupKeys = Object.keys(sourceGroups);
          if (sourceGroupKeys.length === 1) visible = sourceGroups[sourceGroupKeys[0]];
        }
        var dynamic = [];
        var expressionNames = (Array.isArray(roll.expressionRefs) ? roll.expressionRefs : []).map(contractRefName);
        var titleRefs = dictionary();
        var sourceTitleLabels = dictionary();
        var sectionFields = repeating && index.fieldSections[repeating.section] || dictionary();
        var titleValue = '';
        var expressionLabels = [];
        (Array.isArray(roll.labelRefs) ? roll.labelRefs : []).forEach(function (ref) {
          var refName = contractRefName(ref);
          var sourceField = sectionFields[refName] || index.fieldGlobal[refName] || scopedControls[refName];
          if (expressionNames.indexOf(refName) < 0 && sourceField &&
            /^(?:name|subject|title|label|skill|skill_name|attribute)$/i.test(trim(ref && ref.field)) &&
            /^(?:text|textarea)$/i.test(trim(sourceField.type)) && !sourceField.hidden &&
            !sourceField.readonly && !sourceField.disabled && !trim(sourceField.default) &&
            // ponytail: 이름칸은 굴림 4개까지만; 더 공유하면 상한 확대.
            (index.labelRefFrequency[refName] || 0) <= 4) {
            var fieldLabels = [sourceField.label].concat(sourceField.aliases || []).map(normalize).filter(Boolean);
            var rawKey = normalize(rawVisible).replace(/(?:name|check|roll)$/i, '');
            var refKey = normalize(refName).replace(/(?:name|check|roll)$/i, '');
            var machineNamed = (normalize(rawVisible) === normalize(roll.name) || normalize(rawVisible) === normalize(roll.key)) &&
              rawKey && refKey && (rawKey.indexOf(refKey) > -1 || refKey.indexOf(rawKey) > -1);
            var editableTitle = /^(?:name|subject|title|label|skill|skill_name|attribute)$/i.test(trim(ref && ref.field)) &&
              /(?:^|_)(?:name|title|label)(?:_|$)/i.test(refName);
            if (fieldLabels.indexOf(normalize(rawVisible)) > -1 || machineNamed || editableTitle) {
              titleRefs[refName] = true;
              fieldLabels.forEach(function (label) { sourceTitleLabels[label] = true; });
            }
          }
          if (expressionNames.indexOf(refName) > -1) {
            var sourceLabel = contractDisplayLabel(sourceField && sourceField.label);
            if (sourceLabel && normalize(sourceLabel) !== normalize(refName)) expressionLabels.push(sourceLabel);
            return;
          }
          var value = contractLabelRef(characterId, contract, roll, row, ref, read);
          if (titleRefs[refName] && value && !titleValue) titleValue = value;
          if (value) dynamic.push({
            value: value,
            frequency: index.labelRefFrequency[refName] || 0,
            title: !!titleRefs[refName],
            subject: /^(?:name|subject|title|label|skill|skill_name|attribute)$/i.test(trim(ref && ref.field)) &&
              sourceField && /^(?:text|textarea)$/i.test(trim(sourceField.type)),
          });
        });
        if (Object.keys(titleRefs).length) {
          if (!titleValue) return;
          rawVisible = '';
          visible = '';
          staticLabels = staticLabels.filter(function (label) { return !sourceTitleLabels[normalize(label)]; });
        }
        dynamic.sort(function (left, right) {
          return Number(!!right.title) - Number(!!left.title) || left.frequency - right.frequency;
        });
        var usefulDynamic = dynamic.filter(function (entry) { return normalize(entry.value) !== characterName; });
        var rowLabels = usefulDynamic.map(function (entry) { return contractDisplayLabel(entry.value); }).filter(Boolean);
        var subjectLabels = usefulDynamic.filter(function (entry) { return entry.subject; })
          .map(function (entry) { return contractDisplayLabel(entry.value); }).filter(Boolean);
        var displayLabels = (row && rowLabels.length ? rowLabels :
          !roll.name && !staticLabels.length && subjectLabels.length ? subjectLabels : [visible])
          .concat(staticLabels.map(contractDisplayLabel).filter(Boolean))
          .concat(expressionLabels)
          .concat(row ? [visible] : rowLabels)
          .map(trim).filter(Boolean);
        if (!displayLabels.length && expressionNames.length === 1) displayLabels.push('자유 주사위');
        var labels = displayLabels
          .concat([rawVisible])
          .concat((roll.aliases || []).filter(function (label) { return !sourceTitleLabels[normalize(label)]; }))
          .concat(staticLabels)
          .concat(expressionNames.length === 1 ? ['자유 주사위', expressionNames[0]] : [])
          .concat([roll.name, roll.key])
          .map(trim).filter(Boolean);
        var unique = dictionary();
        labels = labels.filter(function (label) {
          var key = normalize(label);
          if (!key || unique[key]) return false;
          unique[key] = true;
          return true;
        });
        result.push({
          characterId: characterId,
          contract: contract,
          roll: roll,
          row: row,
          key: roll.key + (row ? '@' + row.id : ''),
          label: displayLabels[0] || '',
          aliases: labels,
          modes: Array.isArray(roll.modes) ? roll.modes : [],
          hidden: visibility === false,
        });
      });
    });
    return result;
  }

  function actionableContractRolls(characterId, inspection, includeHidden, objects, readLive) {
    if (inspection && inspection.status === 'matched') return scannedContractRolls(characterId, includeHidden);
    var candidates = sourceCandidateInspections(inspection);
    if (!candidates.length) return [];
    objects = objects || attrObjects(characterId);
    readLive = readLive || cachedAttrReader(characterId);
    var rolls = [];
    candidates.forEach(function (candidate) {
      rolls = rolls.concat(contractRolls(characterId, candidate, objects, includeHidden, readLive));
    });
    return rolls;
  }

  function contractFieldMatch(index, name) {
    if (index.fieldGlobal[name]) return { field: index.fieldGlobal[name], name: name, rowId: '' };
    var matches = triePrefixes(index.fieldPrefixes, name);
    for (var i = matches.length - 1; i >= 0; i -= 1) {
      var match = matches[i];
      var fieldName = matchedField(match.fields, name, match.prefix.length);
      if (!fieldName) continue;
      var suffix = '_' + fieldName;
      var rowId = name.substring(match.prefix.length, name.length - suffix.length);
      if (!rowId) continue;
      return {
        field: index.fieldSections[match.section][fieldName],
        name: name,
        rowId: rowId,
        section: match.section,
        prefix: match.prefix,
      };
    }
    return null;
  }

  function localFieldLabel(field) {
    var label = contractDisplayLabel(field && field.label);
    var group = contractDisplayLabel(field && field.groupLabel);
    if (!group) return label;
    var groupKey = normalize(group);
    var candidates = [label].concat(field && field.aliases || []).map(contractDisplayLabel);
    for (var index = 0; index < candidates.length; index += 1) {
      var key = normalize(candidates[index]);
      if (groupKey && key.indexOf(groupKey) === 0) key = key.slice(groupKey.length);
      else if (groupKey && key.slice(-groupKey.length) === groupKey) key = key.slice(0, -groupKey.length);
      if (/^(?:현재|current|now)(?:값|수치|점수|value|score)?$/i.test(key)) return '현재';
      if (/^(?:최대|maximum|max)(?:값|수치|점수|value|score)?$/i.test(key)) return '최대';
      if (/^(?:시작|초기|start|starting|initial)(?:값|수치|점수|value|score)?$/i.test(key)) return '시작';
      if (/^(?:45|80%|threshold|문턱값|기준값)$/i.test(key)) return '4/5';
    }
    return label;
  }

  function fieldChoiceLegend(value) {
    return /(?:^|\s)-?\d+(?:\.\d+)?\s*=\s*\S+/.test(trim(value));
  }

  function fieldRangeOnly(value) {
    return /^\(?\s*-?\d+(?:\.\d+)?\s*(?:to|~|\u2013|\u2014)\s*-?\d+(?:\.\d+)?\s*\)?$/i.test(trim(value));
  }

  function cleanFieldRange(value) {
    return trim(value).replace(/\s*\(\s*-?\d+(?:\.\d+)?\s*(?:to|~|\u2013|\u2014)\s*-?\d+(?:\.\d+)?\s*\)\s*$/i, '');
  }

  function fieldLabel(field, rowLabel) {
    var name = trim(field && field.name);
    var label = localFieldLabel(field) || name;
    var group = contractDisplayLabel(field && field.groupLabel);
    var role = normalize(label);
    var generic = /^(?:현재|최대|current|maximum|max|value|score|값|수치|점수)$/i;
    if (group && /^(?:현재|current|now)(?:값|수치|점수|value|score)?$/i.test(role)) {
      var sourceLabel = contractDisplayLabel(field && field.label);
      label = /^(?:현재|current|now).+|.+(?:현재|current|now)$/i.test(normalize(sourceLabel)) &&
        normalize(sourceLabel) !== normalize(name) && !generic.test(normalize(sourceLabel))
        ? sourceLabel : group;
    }
    else if (group && /^(?:최대|maximum|max|시작|초기|start|starting|initial|45|80%|threshold|문턱값|기준값)(?:값|수치|점수|value|score)?$/i.test(role))
      label = /[가-힣]/.test(label) ? label + ' ' + group : group + ' ' + label;
    if (normalize(label) === normalize(name) || generic.test(normalize(label)) || fieldChoiceLegend(label)) {
      var preferred = (field && field.aliases || []).map(contractDisplayLabel).filter(function (alias) {
        return alias && normalize(alias) !== normalize(name) && !generic.test(normalize(alias)) &&
          !fieldChoiceLegend(alias) && !fieldRangeOnly(alias);
      })[0];
      if (preferred) label = cleanFieldRange(preferred);
    }
    if (rowLabel && normalize(rowLabel) !== normalize(label)) return rowLabel + ' / ' + label;
    return rowLabel || label;
  }

  function numericRadioField(field) {
    var range = field && field.radioRange;
    return !!field && field.type === 'radio' && field.numericCandidate &&
      Array.isArray(range) && range.length === 2 &&
      range.every(function (value) { return typeof value === 'number' && isFinite(value) && Math.floor(value) === value; }) &&
      range[0] <= range[1];
  }

  function userFacingField(field) {
    if (numericRadioField(field)) return true;
    var name = trim(field && field.name);
    var label = contractDisplayLabel(field && field.label);
    if (label && (normalize(label) !== normalize(name) || /[가-힣]/.test(name))) return true;
    return (field && field.aliases || []).some(function (alias) {
      return contractDisplayLabel(alias) && normalize(alias) !== normalize(name);
    });
  }

  function numericFieldValue(characterId, value, defaults, rowContext) {
    if (value === undefined || value === null || trim(value) === '') return null;
    var resolved = resolvedResourceValue(characterId, value, defaults, rowContext);
    return resolved.number === null || !isFinite(resolved.number) ? null : resolved.number;
  }

  function fieldAliases(field, label, rowLabel, fullName) {
    var seen = dictionary();
    return [label, rowLabel, localFieldLabel(field)]
      .concat(field && field.aliases || [])
      .concat([field && field.name, fullName])
      .map(trim).filter(function (alias) {
        var key = normalize(alias);
        if (!key || seen[key]) return false;
        seen[key] = true;
        return true;
      });
  }

  function fieldPairLabels(field, label, rowLabel) {
    var seen = dictionary();
    var group = contractDisplayLabel(field && field.groupLabel);
    var local = localFieldLabel(field);
    return [label, rowLabel, local, group, group && local ? group + ' ' + local : '', group && local ? local + ' ' + group : '']
      .map(contractDisplayLabel).filter(function (value) {
        var key = normalize(value);
        if (!key || seen[key]) return false;
        seen[key] = true;
        return true;
      });
  }

  function sourceFieldLabels(field, label, rowLabel) {
    var seen = dictionary();
    return fieldPairLabels(field, label, rowLabel).concat(field && field.aliases || [])
      .map(contractDisplayLabel).filter(function (value) {
        var key = normalize(value);
        if (!key || seen[key]) return false;
        seen[key] = true;
        return true;
      });
  }

  function maximumFieldLabel(labels) {
    return (labels || []).some(function (label) {
      return /^(?:최대|maximum|max)(?:값|수치|점수)?$/i.test(normalize(label)) ||
        /^(?:최대|maximum|max).+$/i.test(normalize(label)) ||
        /[_-](?:max|maximum)$/i.test(trim(label));
    });
  }

  function fieldPairKeys(labels) {
    var ignored = {
      current: true, maximum: true, max: true, value: true, score: true,
      현재: true, 최대: true, 값: true, 수치: true, 점수: true,
    };
    var seen = dictionary();
    var result = [];
    (labels || []).forEach(function (label) {
      var key = normalize(label);
      var stripped = key.replace(/^(?:현재|최대|current|maximum|max)/i, '');
      [key, stripped].forEach(function (candidate) {
        if (!candidate || ignored[candidate] || seen[candidate]) return;
        seen[candidate] = true;
        result.push(candidate);
      });
    });
    return result;
  }

  function fieldPairNameKey(name) {
    return normalize(name)
      .replace(/^(?:현재|최대|current|maximum|max|now)/i, '')
      .replace(/(?:현재|최대|current|maximum|max|now)$/i, '');
  }

  function pairResourceMaximums(resources, references) {
    var maximumByKey = dictionary();
    var maximumByName = dictionary();
    (references || []).forEach(function (candidate, index) {
      if (!maximumFieldLabel(candidate.sourceLabels)) return;
      var nameKey = fieldPairNameKey(candidate.name);
      if (nameKey) {
        if (!maximumByName[nameKey]) maximumByName[nameKey] = [];
        maximumByName[nameKey].push({ candidate: candidate, index: index });
      }
      fieldPairKeys(candidate.pairLabels).forEach(function (key) {
        if (!maximumByKey[key]) maximumByKey[key] = [];
        maximumByKey[key].push({ candidate: candidate, index: index });
      });
    });
    (resources || []).forEach(function (item) {
      if (item.max !== null || maximumFieldLabel(item.sourceLabels)) return;
      var scores = dictionary();
      var candidates = [];
      function score(entry, amount) {
        if (entry.candidate.name === item.name) return;
        if (!scores[entry.index]) candidates.push(entry);
        scores[entry.index] = (scores[entry.index] || 0) + amount;
      }
      fieldPairKeys(item.pairLabels).forEach(function (key) {
        (maximumByKey[key] || []).forEach(function (entry) {
          score(entry, 1);
        });
      });
      (maximumByName[fieldPairNameKey(item.name)] || []).forEach(function (entry) {
        score(entry, 1000);
      });
      var best = 0;
      var match = null;
      var matchCount = 0;
      candidates.forEach(function (entry) {
        var score = scores[entry.index];
        if (score < best) return;
        if (score > best) {
          best = score;
          match = entry.candidate;
          matchCount = 1;
        } else matchCount += 1;
      });
      if (matchCount === 1) {
        item.max = match.value;
        item._maxDefinition = match._definition || '';
      }
    });
  }

  function liveResourceFields(fields) {
    var result = dictionary();
    var maximums = dictionary();
    var maximumsByName = dictionary();
    (fields || []).filter(function (field) {
      return !field.section && !field.hidden &&
        /^(?:text|number|range)$/.test(trim(field.type).toLowerCase()) &&
        maximumFieldLabel(sourceFieldLabels(field, fieldLabel(field, ''), ''));
    }).forEach(function (field) {
      var nameKey = fieldPairNameKey(field.name);
      if (nameKey) {
        if (!maximumsByName[nameKey]) maximumsByName[nameKey] = [];
        maximumsByName[nameKey].push(field);
      }
      fieldPairKeys(fieldPairLabels(field, localFieldLabel(field), '')).forEach(function (key) {
        if (!maximums[key]) maximums[key] = [];
        maximums[key].push(field);
      });
    });
    (fields || []).forEach(function (field) {
      if (field.section || field.hidden || field.readonly || field.disabled || !field.numericCandidate ||
        !userFacingField(field) || !(numericRadioField(field) || /^(?:text|number|range)$/.test(trim(field.type).toLowerCase()))) return;
      if (numericRadioField(field)) result[field.name] = true;
      var pairLabels = fieldPairLabels(field, localFieldLabel(field), '');
      var labels = sourceFieldLabels(field, fieldLabel(field, ''), '').concat(field.name);
      if (trim(field.max) && ['health', 'sanity', 'magicPoints'].some(function (role) {
        return matchesDetectedRole(labels, role);
      })) result[field.name] = true;
      var keys = fieldPairKeys(pairLabels);
      var namedMaximums = maximumsByName[fieldPairNameKey(field.name)] || [];
      if (namedMaximums.length === 1 && namedMaximums[0] !== field) {
        result[field.name] = true;
        result[namedMaximums[0].name] = true;
      }
      keys.forEach(function (key) {
        var matches = (maximums[key] || []).filter(function (maximum) { return maximum !== field; });
        if (matches.length !== 1) return;
        result[field.name] = true;
        result[matches[0].name] = true;
      });
    });
    return result;
  }

  function contractUnsavedFieldValue(field, live, fallback, maximum) {
    var variants = !maximum && Array.isArray(field && field.defaultVariants) ? field.defaultVariants : [];
    if (variants.length) fallback = variants[0];
    if (live !== undefined && live !== null && trim(live) !== '') {
      var hiddenDefault = variants.slice(1).some(function (value) {
        return trim(value) === trim(live);
      });
      if (!hiddenDefault) return live;
    }
    return fallback;
  }

  function contractFieldItems(characterId, inspection, objects, rolls, readLive, includeDefinition) {
    var result = { resources: [], tracked: dictionary(), aliases: dictionary(), byAttribute: dictionary(), references: [] };
    if (!inspection || inspection.status !== 'matched') return result;
    var fields = Array.isArray(inspection.contract.fields) ? inspection.contract.fields : [];
    if (!fields.length) return result;
    var index = contractRuntimeIndex(inspection.contract);
    var liveFields = liveResourceFields(fields);
    var fieldDefaults = dictionary();
    fields.filter(function (field) { return !field.section; }).forEach(function (field) {
      if (own(field, 'default') && trim(field.default) !== '') fieldDefaults[field.name] = field.default;
      else if (trim(field.type).toLowerCase() === 'checkbox') fieldDefaults[field.name] = '0';
    });
    readLive = readLive || cachedAttrReader(characterId);
    var attributes = objects || attrObjects(characterId);
    var attributeByName = dictionary();
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name) attributeByName[name] = attribute;
    });
    var rowLabels = dictionary();
    (rolls || []).forEach(function (instance) {
      var repeating = instance.roll && contractRepeating(instance.roll);
      if (!instance.row || !repeating) return;
      var section = trim(repeating.section);
      var key = (instance.row.prefix || 'repeating_' + section + '_') + '|' + instance.row.id;
      if (!rowLabels[key] && trim(instance.label)) rowLabels[key] = trim(instance.label);
    });
    function fieldVisibility(match) {
      var condition = match.field && match.field.visibility;
      if (!condition) return true;
      return contractVisibilityResult(condition, function (name, atom) {
        var scope = trim(atom && atom.scope).toLowerCase();
        var fullName = name;
        if (scope !== 'global' && match.section && match.rowId)
          fullName = match.prefix + match.rowId + '_' + name;
        if (attributeByName[fullName])
          return { known: true, value: attributeByName[fullName].get('current') };
        var live = readLive(fullName, 'current');
        if (live !== undefined && live !== null && String(live) !== '')
          return { known: true, value: live };
        var sourceField = match.section && index.fieldSections[match.section]
          ? index.fieldSections[match.section][name]
          : index.fieldGlobal[name];
        if (sourceField && own(sourceField, 'default'))
          return { known: true, value: sourceField.default };
        var control = index.controls[name];
        return control && own(control, 'default')
          ? { known: true, value: control.default }
          : { known: false };
      });
    }
    function fieldRowContext(match) {
      if (!match.section || !match.rowId) return null;
      var fields = index.fieldSections[match.section] || dictionary();
      var prefix = match.prefix + match.rowId + '_';
      var values = dictionary();
      Object.keys(fields).forEach(function (name) {
        var field = fields[name];
        var fullName = prefix + name;
        var attribute = attributeByName[fullName];
        var current = attribute ? attribute.get('current') : undefined;
        var maximum = attribute ? attribute.get('max') : undefined;
        if (attribute) {
          if ((current === undefined || trim(current) === '') && own(field, 'default')) current = field.default;
          if ((maximum === undefined || trim(maximum) === '') && trim(field.max)) maximum = field.max;
        } else {
          current = contractUnsavedFieldValue(field, readLive(fullName, 'current'), field.default, false);
          var liveMaximum = readLive(fullName, 'max');
          maximum = liveMaximum !== undefined && liveMaximum !== null && trim(liveMaximum) !== ''
            ? liveMaximum : field.max;
        }
        if (current !== undefined && trim(current) !== '') values[fullName + '|current'] = current;
        if (maximum !== undefined && trim(maximum) !== '') values[fullName + '|max'] = maximum;
      });
      return { scopes: [prefix], fields: fields, values: values };
    }
    function sourceFieldValue(name, valueType) {
      var attribute = attributeByName[name];
      if (attribute) return attribute.get(valueType === 'max' ? 'max' : 'current');
      var field = index.fieldGlobal[name];
      var fallback = field && field[valueType === 'max' ? 'max' : 'default'];
      var live = readLive(name, valueType);
      if (valueType !== 'max' && field && field.numericCandidate && !field.hidden && !field.readonly && !field.disabled)
        return contractUnsavedFieldValue(field, live, fallback, false);
      return live !== undefined && live !== null && trim(live) !== '' ? live : fallback;
    }
    var valueContext = { scopes: [], values: dictionary(), resolveAttribute: sourceFieldValue };
    function add(match, attribute, fallback) {
      var field = match.field;
      if (!userFacingField(field) && !liveFields[field.name]) return;
      var visible = fieldVisibility(match);
      if (visible === false) return;
      var fullName = match.name;
      var raw = attribute ? attribute.get('current') : fallback;
      var rowLabel = match.section ? rowLabels[match.prefix + '|' + match.rowId] || '' : '';
      var label = fieldLabel(field, rowLabel);
      var aliases = fieldAliases(field, label, rowLabel, fullName);
      var type = trim(field.type).toLowerCase();
      var sourceLabels = sourceFieldLabels(field, label, rowLabel);
      var pairLabels = fieldPairLabels(field, localFieldLabel(field), rowLabel);
      var rowContext = fieldRowContext(match) || valueContext;
      rowContext.resolveAttribute = sourceFieldValue;
      var localLabel = localFieldLabel(field);
      var statusResource = !!liveFields[fullName] &&
        !/^(?:최대|시작|초기|maximum|max|start|starting|initial|45|80%|threshold|문턱값|기준값)/i.test(normalize(localLabel));
      var definition = includeDefinition ? JSON.stringify(field) : '';
      var structure = includeDefinition ? JSON.stringify([
        type, trim(field.section), !!field.numericCandidate, !!field.trackCandidate,
        !!field.readonly, !!field.disabled, !!field.hidden, trim(field.default), trim(field.max), trim(field.onValue),
        field.defaultVariants || [], field.radioRange || [],
      ]) : '';
      var number = (numericRadioField(field) || /^(?:text|number|range)$/.test(type))
        ? numericFieldValue(characterId, raw, fieldDefaults, rowContext) : null;
      var tracked = !index.presentationControls[field.name] && !!field.trackCandidate &&
        (number !== null || type === 'checkbox');
      if (tracked) result.tracked[fullName] = {
        attribute: attribute || null,
        name: fullName,
        label: label,
        aliases: aliases,
        sourceLabels: sourceLabels,
        pairLabels: pairLabels,
        fieldLabel: localFieldLabel(field),
        kind: type === 'checkbox' ? 'toggle' : 'number',
        onValue: trim(field.onValue),
        value: raw,
        automationVisible: visible === true,
        _definition: definition,
        _structure: structure,
      };
      if (tracked && numericRadioField(field)) result.tracked[fullName].radioRange = field.radioRange.slice();
      if (number === null) return;
      // A literal HTML input limit is not the character's resource maximum.
      var sourceMaximum = /@\{[^}]+\}/.test(trim(field.max)) ? field.max : '';
      var maxRaw = attribute && attribute.get('max');
      if (trim(maxRaw) === '' && sourceMaximum) {
        var liveMax = readLive(fullName, 'max');
        if (liveMax !== undefined && liveMax !== null && trim(liveMax) !== '') maxRaw = liveMax;
      }
      if (trim(maxRaw) === '') maxRaw = sourceMaximum;
      var item = {
        attribute: attribute || null,
        name: fullName,
        label: label,
        aliases: aliases,
        sourceLabels: sourceLabels,
        pairLabels: pairLabels,
        fieldLabel: localFieldLabel(field),
        value: number,
        max: numericFieldValue(characterId, maxRaw, fieldDefaults, rowContext),
        writable: !!field.numericCandidate,
        statusResource: statusResource,
        automationVisible: visible === true,
        _definition: definition,
        _structure: structure,
        _maxDefinition: sourceMaximum ? JSON.stringify(sourceMaximum) : '',
      };
      if (numericRadioField(field)) item.radioRange = field.radioRange.slice();
      result.references.push(item);
      if (!field.numericCandidate) return;
      result.resources.push(item);
      result.byAttribute[fullName] = item;
      aliases.forEach(function (alias) {
        var key = normalize(alias);
        if (!result.aliases[key]) result.aliases[key] = [];
        result.aliases[key].push(item);
      });
    }
    fields.filter(function (field) { return !field.section; }).forEach(function (field) {
      var name = trim(field.name);
      var attribute = attributeByName[name];
      if (attribute) add({ field: field, name: name, rowId: '' }, attribute);
      else if (!field.hidden && field.trackCandidate && trim(field.type).toLowerCase() === 'checkbox')
        add({ field: field, name: name, rowId: '' }, null, field.default);
      else if (!field.hidden && (numericRadioField(field) || /^(?:text|number|range)$/.test(trim(field.type).toLowerCase())) && own(field, 'default')) {
        var fallback = field.default;
        if (liveFields[name]) {
          var live = readLive(name, 'current');
          fallback = contractUnsavedFieldValue(field, live, fallback, false);
        }
        add({ field: field, name: name, rowId: '' }, null, fallback);
      }
    });
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (index.fieldGlobal[name]) return;
      var match = contractFieldMatch(index, name);
      if (match && match.section) add(match, attribute);
    });
    pairResourceMaximums(result.resources, result.references);
    result.resources.sort(function (left, right) {
      return left.label.localeCompare(right.label) || left.name.localeCompare(right.name);
    });
    return result;
  }

  function contractFieldItemFingerprint(item) {
    return JSON.stringify([
      item.name, item._structure || '', item.kind || '', trim(item.onValue),
      item.writable !== false, item.automationVisible === true,
    ]);
  }

  function commonContractFieldItems(characterId, inspection, objects, rolls, readLive) {
    if (inspection && inspection.status === 'matched')
      return contractFieldItems(characterId, inspection, objects, rolls, readLive);
    var candidates = sourceCandidateInspections(inspection);
    if (!candidates.length)
      return { resources: [], tracked: dictionary(), aliases: dictionary(), byAttribute: dictionary(), references: [] };
    var results = candidates.map(function (candidate) {
      return contractFieldItems(
        characterId,
        candidate,
        objects,
        contractRolls(characterId, candidate, objects, false, readLive),
        readLive,
        true,
      );
    });
    function shared(property, dictionaryProperty) {
      var lists = results.map(function (result) {
        return dictionaryProperty
          ? Object.keys(result[property] || {}).map(function (name) { return result[property][name]; })
          : result[property] || [];
      });
      var indexes = lists.slice(1).map(function (items) {
        var found = dictionary();
        items.forEach(function (item) { found[contractFieldItemFingerprint(item)] = item; });
        return found;
      });
      return (lists[0] || []).filter(function (item) {
        var key = contractFieldItemFingerprint(item);
        return indexes.every(function (index) { return !!index[key]; });
      }).map(function (item) {
        var key = contractFieldItemFingerprint(item);
        var peers = [item].concat(indexes.map(function (index) { return index[key]; }));
        var merged = merge({}, item);
        ['aliases', 'sourceLabels'].forEach(function (property) {
          var seen = dictionary();
          merged[property] = [];
          peers.forEach(function (peer) {
            (peer[property] || []).forEach(function (value) {
              var normalized = normalize(value);
              if (!normalized || seen[normalized]) return;
              seen[normalized] = true;
              merged[property].push(value);
            });
          });
        });
        if (!own(item, 'max')) return merged;
        merged.max = peers.every(function (peer) {
          return peer.max === item.max;
        }) ? item.max : null;
        return merged;
      });
    }
    var value = {
      resources: shared('resources'),
      tracked: dictionary(),
      aliases: dictionary(),
      byAttribute: dictionary(),
      references: shared('references'),
    };
    pairResourceMaximums(value.resources, value.references);
    shared('tracked', true).forEach(function (item) { value.tracked[item.name] = item; });
    value.resources.forEach(function (item) {
      value.byAttribute[item.name] = item;
      item.aliases.forEach(function (alias) {
        var key = normalize(alias);
        if (!value.aliases[key]) value.aliases[key] = [];
        value.aliases[key].push(item);
      });
    });
    return value;
  }

  function invalidate(characterId) {
    if (characterId) {
      delete cache[characterId];
      delete attributeObjectCache[characterId];
    } else {
      cache = {};
      attributeObjectCache = {};
      contractMatchCache = {};
    }
  }

  function scan(characterId, force) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    if (!force && cache[characterId] && cache[characterId].characterName === trim(character.get('name')))
      return cache[characterId];
    var objects = attrObjects(characterId);
    attributeObjectCache[characterId] = objects;
    var contractMatch = contractMatchCache[characterId] || inspectContracts(characterId, objects);
    var value = {};
    value.warnings = [];
    value.ok = true;
    value.profileId = 'sheet';
    value.score = contractMatch.match && contractMatch.match.score || 0;
    value.matched = contractMatch.status === 'matched';
    value.characterId = characterId;
    value.characterName = trim(character.get('name'));
    value.contractMatch = contractMatch;
    value.attributeByName = dictionary();
    objects.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name) value.attributeByName[name] = attribute;
    });
    var readLive = cachedAttrReader(characterId);
    value.contractAllRolls = commonContractRolls(characterId, value.contractMatch, true, objects, readLive);
    value.contractRolls = value.contractAllRolls.filter(function (instance) { return !instance.hidden; });
    var fields = commonContractFieldItems(characterId, value.contractMatch, objects, value.contractRolls, readLive);
    value.resources = fields.resources;
    value.trackedFields = fields.tracked;
    value.resourceAliases = fields.aliases;
    value.resourcesByAttribute = fields.byAttribute;
    value.fieldReferences = fields.references;
    cache[characterId] = value;
    return value;
  }

  function scannedContractRolls(characterId, includeHidden) {
    var data = scan(characterId);
    return (includeHidden ? data.contractAllRolls : data.contractRolls) || [];
  }

  function preferredContractRolls(data) {
    // 일반/보너스 짝을 먼저 고른 뒤 시트 후보 간 동등화를 해야 짝이 유실되지 않습니다.
    var instances = actionableContractRolls(data.characterId, data.contractMatch, false);
    var preferred = dictionary();
    collapseEquivalentContractCandidates(data.characterId, preferSingleInlineRollActions(
      uniqueContractCandidates(instances.map(function (instance) {
        return { instance: instance };
      })),
    )).forEach(function (candidate) {
      preferred[candidate.instance.contract.id + '|' + candidate.instance.key] = true;
    });
    return instances.filter(function (instance) {
      return preferred[instance.contract.id + '|' + instance.key];
    });
  }

  var DETECTED_ROLE_LABELS = {
    health: ['체력', 'hp', 'hitpoint', 'hitpoints'],
    sanity: ['이성', 'san', 'sanity'],
    magicPoints: ['마력', 'mp', 'magicpoint', 'magicpoints', 'mana'],
    startingSanity: ['시작이성', '초기이성', 'startingsanity', 'initialsanity'],
    majorWound: ['중상', 'majorwound'],
    dying: ['빈사', 'dying'],
    longInsanity: ['장기', '장기광기', '장기적광기', 'indefiniteinsanity', 'indefinsane'],
    temporaryInsanity: ['일시', '일시광기', '일시적광기', '단기광기', 'temporaryinsanity', 'tempinsane'],
    intelligence: ['지능', 'int', 'intelligence'],
    characteristic: [
      '근력', 'str', 'strength', '건강', 'con', 'constitution', '크기', 'siz', 'size',
      '민첩', '민첩성', 'dex', 'dexterity', '외모', 'app', 'appearance',
      '지능', 'int', 'intelligence', '정신', '정신력', 'pow', 'power', '교육', 'edu', 'education',
    ],
  };

  function detectedLabelKeys(labels) {
    var seen = dictionary();
    var result = [];
    (labels || []).forEach(function (label) {
      var key = normalize(contractDisplayLabel(label));
      var stripped = key
        .replace(/^(?:현재|current)/i, '')
        .replace(/(?:현재|current|값|수치|점수|value|score|체크|check|굴림|roll|판정)$/i, '');
      [key, stripped].forEach(function (candidate) {
        if (!candidate || seen[candidate]) return;
        seen[candidate] = true;
        result.push(candidate);
      });
    });
    return result;
  }

  function matchesDetectedRole(labels, role) {
    var wanted = DETECTED_ROLE_LABELS[role] || [];
    return detectedLabelKeys(labels).some(function (key) { return wanted.indexOf(key) > -1; });
  }

  function uniqueDetectedItems(items, role) {
    function collect(useToggleAliases) {
      var seen = dictionary();
      return (items || []).filter(function (item) {
        var labels = item && item.kind === 'toggle' && item.fieldLabel && !useToggleAliases
          ? [item.fieldLabel] : item && item.sourceLabels;
        if (!item || item.automationVisible !== true || !matchesDetectedRole(labels, role) || seen[item.name]) return false;
        seen[item.name] = true;
        return true;
      });
    }
    var matches = collect(false);
    if (!matches.length && (items || []).some(function (item) { return item && item.kind === 'toggle'; }))
      matches = collect(true);
    return { item: matches.length === 1 ? matches[0] : null, ambiguous: matches.length > 1, matches: matches };
  }

  function linkedStartingSanityField(item, sanityName, labels) {
    var starting = detectedLabelKeys(labels).some(function (key) {
      return /^(?:시작|초기|starting|initial|start)(?:값|수치|점수|value|score)?$/i.test(key);
    });
    var candidateKey = fieldPairNameKey(item && item.name)
      .replace(/^(?:starting|initial|start|시작|초기)/i, '')
      .replace(/(?:starting|initial|start|시작|초기)$/i, '');
    return starting && candidateKey && candidateKey === fieldPairNameKey(sanityName);
  }

  function detectedFieldRole(data, role, kind) {
    var items = kind === 'toggle'
      ? Object.keys(data.trackedFields || {}).map(function (name) { return data.trackedFields[name]; })
        .filter(function (item) { return item.kind === 'toggle'; })
      : (data.resources || []).filter(function (item) {
          return role === 'startingSanity' ||
            !maximumFieldLabel(item.sourceLabels) &&
            !/^(?:시작|start|초기|initial)/i.test(normalize(item.fieldLabel));
        });
    var detected = uniqueDetectedItems(items, role);
    if (role !== 'startingSanity' || detected.matches.length) return detected;
    var sanity = uniqueDetectedItems((data.resources || []).filter(function (item) {
      return !maximumFieldLabel(item.sourceLabels) &&
        !/^(?:시작|start|초기|initial)/i.test(normalize(item.fieldLabel));
    }), 'sanity');
    if (!sanity.item) return detected;
    var seen = dictionary();
    var matches = items.filter(function (item) {
      if (!item || item.automationVisible !== true || seen[item.name] ||
        !linkedStartingSanityField(item, sanity.item.name, item.sourceLabels)) return false;
      seen[item.name] = true;
      return true;
    });
    return { item: matches.length === 1 ? matches[0] : null, ambiguous: matches.length > 1, matches: matches };
  }

  function detectedRollLabels(instance) {
    return [instance && instance.label, instance && instance.roll && instance.roll.label]
      .concat(instance && instance.roll && instance.roll.aliases || [])
      .concat((instance && instance.roll && instance.roll.staticLabels || []).map(function (entry) {
        return entry && entry.value;
      }));
  }

  function neutralSourceRoll(instance) {
    var roll = instance && instance.roll;
    if (!roll || (Array.isArray(instance.modes) && instance.modes.length)) return false;
    var diceFields = 0;
    String(roll.raw || '').replace(/\{\{\s*[^={}]+?\s*=\s*([^}]*)\}\}/g, function (token, value) {
      if (/\[\[[\s\S]*?\b\d*d\d+/i.test(value)) diceFields += 1;
      return token;
    });
    if (diceFields !== 1) return false;
    var template = instance.contract && instance.contract.resultTemplates &&
      instance.contract.resultTemplates[roll.template];
    var groups = dictionary();
    (template && Array.isArray(template.rules) ? template.rules : []).forEach(function (rule) {
      if (rule && own(rule, 'group')) groups[String(rule.group)] = true;
    });
    return Object.keys(groups).length <= 1;
  }

  function detectedRollRole(data, role) {
    var seen = dictionary();
    var rolls = preferredContractRolls(data);
    var matches = rolls.filter(function (instance) {
      var key = instance && instance.key;
      if (!key || seen[key] || !matchesDetectedRole(detectedRollLabels(instance), role)) return false;
      seen[key] = true;
      return true;
    });
    if (!matches.length) {
      var field = detectedFieldRole(data, role, 'resource');
      var namedFields = (data.resources || []).filter(function (item) {
        return item.automationVisible === true && matchesDetectedRole([item.name], role);
      });
      var name = field.item && field.item.name || (namedFields.length === 1 && namedFields[0].name);
      seen = dictionary();
      if (name) matches = rolls.filter(function (instance) {
        var key = instance && instance.key;
        var references = false;
        String(instance && instance.roll && instance.roll.raw || '').replace(
          /@\{([^{}|]+)(?:\|max)?\}/g,
          function (token, sourceName) {
            if (contractRowAttr(instance.contract, instance.roll, instance.row, trim(sourceName)) === name)
              references = true;
            return token;
          },
        );
        if (!key || seen[key] || !references) return false;
        seen[key] = true;
        return true;
      });
    }
    matches = preferSingleInlineRollActions(matches.map(function (instance) {
      return { instance: instance };
    })).map(function (candidate) { return candidate.instance; });
    if (matches.length > 1) {
      var neutral = matches.filter(neutralSourceRoll);
      if (neutral.length === 1) matches = neutral;
    }
    return { item: matches.length === 1 ? matches[0] : null, ambiguous: matches.length > 1, matches: matches };
  }

 function canControl(character, playerId) {
    if (!character) return false;
    if (playerId === 'API' || playerIsGM(playerId)) return true;
    var controlled = trim(character.get('controlledby'))
      .split(',')
      .map(trim)
      .filter(Boolean);
    return controlled.indexOf('all') > -1 || controlled.indexOf(playerId) > -1;
  }

  function hasPlayerController(character) {
    return trim(character && character.get('controlledby'))
      .split(',')
      .map(trim)
      .filter(Boolean)
      .some(function(id){return id==='all'||getObj('player',id)&&!playerIsGM(id);});
  }

  function profileCharacters() {
    return characterObjects().filter(function (character) {
      return usableContractInspection(inspectContracts(character.id));
    });
  }

  function resolveCharacterName(query, characters) {
    var wanted = normalize(query);
    if (!wanted) return { ok: false, error: '캐릭터 이름을 입력해 주세요.' };
    characters = characters || profileCharacters();
    var exact = characters.filter(function (character) {
      return normalize(character.get('name')) === wanted;
    });
    if (exact.length === 1) return { ok: true, character: exact[0] };
    var partial = characters.filter(function (character) {
      return normalize(character.get('name')).indexOf(wanted) > -1;
    });
    if (partial.length === 1) return { ok: true, character: partial[0] };
    if (partial.length > 1)
      return {
        ok: false,
        error: '이름이 비슷한 캐릭터가 여러 명입니다: ' + partial.map(function (character) {
          return trim(character.get('name'));
        }).join(', '),
      };
    return { ok: false, error: '이름에 ' + trim(query) + '이(가) 들어간 캐릭터를 찾지 못했습니다.' };
  }

  function resolveCharacter(msg, explicitId) {
    if (!explicitId && msg && own(msg, '_kibSheetResolvedCharacter'))
      return msg._kibSheetResolvedCharacter;
    var resolved = resolveCharacterNow(msg, explicitId);
    if (!explicitId && msg) msg._kibSheetResolvedCharacter = resolved;
    return resolved;
  }

  function speakingCharacter(msg) {
    var player = getObj('player', msg && msg.playerid);
    var match = trim(player && player.get('speakingas')).match(/^character\|(.+)$/i);
    if (!match)
      return { ok: false, error: '채팅 입력창의 As를 사용할 캐릭터로 바꾼 뒤 다시 입력해 주세요.' };
    var character = getObj('character', match[1]);
    if (!character) return { ok: false, error: '현재 As 캐릭터를 찾지 못했습니다.' };
    return canControl(character, msg.playerid)
      ? { ok: true, character: character }
      : { ok: false, error: '현재 As 캐릭터를 조작할 권한이 없습니다.' };
  }

  function resolveCharacterNow(msg, explicitId) {
    if (explicitId) {
      var direct = getObj('character', explicitId);
      if (!direct) return { ok: false, error: '버튼에 기록된 캐릭터를 찾지 못했습니다.' };
      if (!canControl(direct, msg.playerid))
        return { ok: false, error: '이 캐릭터를 조작할 권한이 없습니다.' };
    }
    var speaking = speakingCharacter(msg);
    if (!speaking.ok) return speaking;
    if (explicitId && speaking.character.id !== explicitId)
      return { ok: false, error: '현재 As 캐릭터와 버튼에 기록된 캐릭터가 다릅니다. 현재 As의 현황을 다시 열어 주세요.' };
    return speaking;
  }

  function resolveInspectionCharacter(msg) {
    if (playerIsGM(msg.playerid)) {
      var managed = getObj('character', initState().managerCharacterId);
      if (managed) return { ok: true, character: managed };
    }
    return resolveCharacter(msg, '');
  }

  function ensureSheet(character) {
    var contractMatch = inspectContracts(character.id);
    if (!usableContractInspection(contractMatch))
      return {
        ok: false,
        error: contractMatch.error || SHEET_NOT_RECOGNIZED,
      };
    return { ok: true, data: scan(character.id) };
  }

  var OUTCOMES = {
    roll: '판정 실행',
    critical: '대성공',
    extreme: '극단적 성공',
    hard: '어려운 성공',
    success: '보통 성공',
    failure: '실패',
    fumble: '대실패',
  };

  function resultKey(system, label) {
    return normalize(system) + ':' + encodeURIComponent(normalize(label));
  }

  function contractCutinKey(instance) {
    return resultKey('sheet', instance.key);
  }

  function templateValue(message, field) {
    var content = String((message && message.content) || '');
    var escaped = String(field).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var match = content.match(new RegExp('\\{\\{\\s*' + escaped + '\\s*=\\s*([^}]*)\\}\\}', 'i'));
    if (!match) return null;
    var value = trim(match[1]);
    if (!value) return null;
    var inline = value.match(/^\$\[\[(\d+)\]\]$/);
    if (inline) {
      var roll = message.inlinerolls && message.inlinerolls[Number(inline[1])];
      var total = roll && roll.results && Number(roll.results.total);
      return isFinite(total) ? total : null;
    }
    var number = Number(value.replace(/^\[\[|\]\]$/g, ''));
    return isFinite(number) ? number : null;
  }

  function templateHasField(message, field) {
    var content = String((message && message.content) || '');
    var escaped = String(field).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('\\{\\{\\s*' + escaped + '\\s*=', 'i').test(content);
  }

  function contractResultMode(message, payload) {
    var mode = 'normal';
    var modeLabel = normalize(payload && payload.modeLabel);
    if (/(?:보너스|bonus).*2/.test(modeLabel)) mode = 'bonus2';
    else if (/(?:보너스|bonus).*1/.test(modeLabel)) mode = 'bonus1';
    else if (/(?:패널티|페널티|penalty).*2/.test(modeLabel)) mode = 'penalty2';
    else if (/(?:패널티|페널티|penalty).*1/.test(modeLabel)) mode = 'penalty1';
    var diceType = templateValue(message, 'dice_type');
    if (mode === 'normal') {
      if (diceType === 1) mode = 'bonus1';
      else if (diceType === 2) mode = 'bonus2';
      else if (diceType === -1) mode = 'penalty1';
      else if (diceType === -2) mode = 'penalty2';
    }
    return mode;
  }

  function sourceResultTemplateForContract(contract, key) {
    if (!contract || !contract.resultTemplates) return null;
    var roll = contractRuntimeIndex(contract).rollsByKey[String(key)];
    if (!roll || !roll.template) return null;
    if (contract.resultTemplates[roll.template]) return contract.resultTemplates[roll.template];
    var wanted = normalize(roll.template);
    var names = Object.keys(contract.resultTemplates);
    for (var index = 0; index < names.length; index += 1) {
      if (normalize(names[index]) === wanted) return contract.resultTemplates[names[index]];
    }
    return null;
  }

  function sourceResultTemplate(payload) {
    if (!payload || !payload.contractId || !payload.key) return null;
    var contracts = sheetContracts();
    for (var i = 0; i < contracts.length; i += 1) {
      var contract = contracts[i];
      if (String(contract.id) === String(payload.contractId))
        return sourceResultTemplateForContract(contract, payload.key);
    }
    return null;
  }

  function sourceResultOperand(message, value) {
    var raw = trim(value);
    if (/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(raw)) return Number(raw);
    return templateValue(message, raw);
  }

  function sourceResultCondition(message, condition) {
    if (!condition || !Array.isArray(condition.args) || !condition.args.length) return false;
    var matched = false;
    if (condition.op === 'present') matched = templateHasField(message, condition.args[0]);
    else {
      var left = sourceResultOperand(message, condition.args[0]);
      if (left === null) matched = false;
      else if (condition.op === 'eq') {
        var right = sourceResultOperand(message, condition.args[1]);
        matched = right !== null && left === right;
      } else if (condition.op === 'gt') {
        var greater = sourceResultOperand(message, condition.args[1]);
        matched = greater !== null && left > greater;
      } else if (condition.op === 'lt') {
        var less = sourceResultOperand(message, condition.args[1]);
        matched = less !== null && left < less;
      } else if (condition.op === 'between') {
        var lower = sourceResultOperand(message, condition.args[1]);
        var upper = sourceResultOperand(message, condition.args[2]);
        matched = lower !== null && upper !== null && left >= lower && left <= upper;
      }
    }
    return condition.not ? !matched : matched;
  }

  function sourceResultGroupMatches(group, mode) {
    var expected = mode === 'bonus2' ? '+2'
      : mode === 'bonus1' ? '+1'
        : mode === 'penalty2' ? '-2'
          : mode === 'penalty1' ? '-1'
            : '0';
    return String(group) === expected;
  }

  function sourceContractResult(message, payload, mode) {
    var template = sourceResultTemplate(payload);
    var rules = template && Array.isArray(template.rules) ? template.rules : [];
    if (!rules.length) return null;
    var grouped = rules.some(function (rule) { return own(rule, 'group'); });
    for (var i = 0; i < rules.length; i += 1) {
      var rule = rules[i];
      if (!rule || !OUTCOMES[rule.outcome] || !Array.isArray(rule.conditions)) continue;
      if (grouped && (!own(rule, 'group') || !sourceResultGroupMatches(rule.group, mode))) continue;
      if (!rule.conditions.every(function (condition) { return sourceResultCondition(message, condition); })) continue;
      var total = templateValue(message, rule.valueField);
      if (total === null) continue;
      return { total: total, outcome: rule.outcome, outcomeLabel: OUTCOMES[rule.outcome] };
    }
    return null;
  }

 function contractResult(message, payload) {
    var target = templateValue(message, 'success');
    var hard = templateValue(message, 'hard');
    var extreme = templateValue(message, 'extreme');
    var critical = templateValue(message, 'critical');
    var fumble = templateValue(message, 'fumble');
    var mode = contractResultMode(message, payload);
    var sourceOutcome = sourceContractResult(message, payload, mode);
    if (sourceOutcome) {
      sourceOutcome.target = target;
      sourceOutcome.hard = hard;
      sourceOutcome.extreme = extreme;
      sourceOutcome.mode = mode;
      return sourceOutcome;
    }
    var roll1 = templateValue(message, 'roll1');
    var roll2 = templateValue(message, 'roll2');
    var roll3 = templateValue(message, 'roll3');
    var rolled = templateValue(message, 'roll');
    if (mode === 'normal' && rolled === null) rolled = roll1;
    if (mode === 'bonus1') rolled = roll1 !== null && roll2 !== null ? Math.min(roll1, roll2) : null;
    else if (mode === 'bonus2') rolled = roll1 !== null && roll2 !== null && roll3 !== null ? Math.min(roll1, roll2, roll3) : null;
    else if (mode === 'penalty1') rolled = roll1 !== null && roll2 !== null ? Math.max(roll1, roll2) : null;
    else if (mode === 'penalty2') rolled = roll1 !== null && roll2 !== null && roll3 !== null ? Math.max(roll1, roll2, roll3) : null;
    if (target === null) {
      var genericTotal = rolled;
      if (genericTotal === null && message && Array.isArray(message.inlinerolls) && message.inlinerolls.length) {
        var firstTotal = message.inlinerolls[0] && message.inlinerolls[0].results && Number(message.inlinerolls[0].results.total);
        genericTotal = isFinite(firstTotal) ? firstTotal : null;
      }
      return genericTotal === null ? null : { total: genericTotal, outcome: 'roll', outcomeLabel: OUTCOMES.roll };
    }
    if (rolled === null) return null;
    var outcome = 'failure';
    if (critical !== null && rolled <= critical) outcome = 'critical';
    else if (fumble !== null && rolled >= fumble) outcome = 'fumble';
    else if (extreme !== null && rolled <= extreme) outcome = 'extreme';
    else if (hard !== null && rolled <= hard) outcome = 'hard';
    else if (rolled <= target) outcome = 'success';
    return {
      total: rolled,
      target: target,
      hard: hard,
      extreme: extreme,
      mode: mode,
      outcome: outcome,
      outcomeLabel: OUTCOMES[outcome],
    };
  }

  function emitResult(payload, message) {
    payload.secret = !!payload.secret || !!(message &&
      (message.type === 'whisper' || message.type === 'gmrollresult'));
    var result = payload.contractId ? contractResult(message, payload) : null;
    if (result) {
      payload.result = result;
      payload.outcome = result.outcome;
      payload.outcomeLabel = result.outcomeLabel;
    }
    var automaticInsanity = payload._automaticInsanity;
    delete payload._automaticInsanity;
    if (automaticInsanity) finishAutomaticInsanity(payload, result, automaticInsanity);
    payload.message = message || null;
    if (typeof KIBScene.broadcast === 'function')
      KIBScene.broadcast('sheet:result', payload);
    else {
      var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
      var listener = cutin && cutin.events && cutin.events['sheet:result'];
      if (typeof listener === 'function') listener(payload);
    }
  }

  function prunePendingResults() {
    var cutoff = Date.now() - 30000;
    Object.keys(pendingResults).forEach(function (token) {
      if (pendingResults[token].created < cutoff) delete pendingResults[token];
    });
  }

  function messageTemplateFields(message) {
    var fields = dictionary();
    String(message && message.content || '').replace(/\{\{\s*([^={}]+?)\s*=\s*([^}]*)\}\}/g, function (token, name, value) {
      fields[trim(name).toLowerCase()] = trim(value);
      return token;
    });
    return fields;
  }

  function sourceTemplateFieldNames(raw) {
    var found = dictionary();
    String(raw || '').replace(/\{\{\s*([^={}]+?)\s*=/g, function (token, name) {
      found[trim(name).toLowerCase()] = true;
      return token;
    });
    return Object.keys(found);
  }

  function normalizedTemplateText(value) {
    return normalize(String(value == null ? '' : value).replace(/<[^>]*>/g, ' '));
  }

  function directResultCharacters(message, fields) {
    var speaking = speakingCharacter(message);
    return speaking.ok ? [speaking.character] : [];
  }

  function directInstanceScore(characterId, instance, fields) {
    var roll = instance.roll || {};
    var score = 0;
    var rejected = false;
    var hasIdentity = false;
    var matchedIdentity = false;
    (Array.isArray(roll.staticLabels) ? roll.staticLabels : []).forEach(function (entry) {
      if (rejected || !entry || typeof entry !== 'object' || !entry.field) return;
      hasIdentity = true;
      var field = trim(entry.field).toLowerCase();
      if (!own(fields, field)) return;
      if (normalizedTemplateText(fields[field]) !== normalizedTemplateText(entry.value)) rejected = true;
      else {
        matchedIdentity = true;
        score += 20;
      }
    });
    (Array.isArray(roll.labelRefs) ? roll.labelRefs : []).forEach(function (ref) {
      if (rejected || !ref || !ref.field) return;
      hasIdentity = true;
      var field = trim(ref.field).toLowerCase();
      if (!own(fields, field)) return;
      var expected = contractLabelRef(characterId, instance.contract, roll, instance.row, ref);
      if (normalizedTemplateText(fields[field]) !== normalizedTemplateText(expected)) rejected = true;
      else {
        matchedIdentity = true;
        score += 20;
      }
    });
    if (rejected || (hasIdentity && !matchedIdentity)) return -1;
    sourceTemplateFieldNames(roll.raw).forEach(function (field) {
      if (own(fields, field)) score += 1;
    });
    var values = dictionary();
    Object.keys(fields).forEach(function (field) {
      var value = normalizedTemplateText(fields[field]);
      if (value) values[value] = true;
    });
    (instance.aliases || []).forEach(function (alias) {
      if (values[normalize(alias)]) score += 3;
    });
    return score;
  }

  function directInstanceIdentity(instance) {
    var roll = instance.roll || {};
    var repeating = contractRepeating(roll);
    return JSON.stringify([
      normalize(roll.name),
      normalize(roll.template),
      normalize(instance.label),
      repeating && repeating.section || '',
      instance.row && instance.row.id || '',
      roll.staticLabels || [],
      roll.labelRefs || [],
    ]);
  }

  function captureDirectResult(message) {
    if (!message || !message.rolltemplate || !Array.isArray(message.inlinerolls)) return false;
    var fields = messageTemplateFields(message);
    var matches = [];
    directResultCharacters(message, fields).forEach(function (character) {
      var data = scan(character.id);
      if (!data.ok || !data.contractMatch) return;
      var instances = data.contractMatch.status === 'matched'
        ? data.contractRolls
        : actionableContractRolls(character.id, data.contractMatch, false);
      var template = normalize(message.rolltemplate);
      instances.forEach(function (instance) {
        if (normalize(instance.roll && instance.roll.template) !== template) return;
        var score = directInstanceScore(character.id, instance, fields);
        if (score > 0) matches.push({ character: character, instance: instance, score: score });
      });
    });
    if (!matches.length) return false;
    var bestScore = Math.max.apply(Math, matches.map(function (match) { return match.score; }));
    var best = matches.filter(function (match) { return match.score === bestScore; });
    var keys = dictionary();
    best.forEach(function (match) { keys[contractCutinKey(match.instance)] = true; });
    if (Object.keys(keys).length !== 1) {
      var identities = dictionary();
      best.forEach(function (match) { identities[directInstanceIdentity(match.instance)] = true; });
      if (Object.keys(identities).length !== 1) return false;
    }
    var match = best[0];
    emitResult({
      source: 'sheet',
      system: 'sheet',
      kind: match.instance.roll.kind || 'contract',
      characterId: match.character.id,
      contractId: match.instance.contract.id,
      sourceHash: match.instance.contract.sourceHash || '',
      key: match.instance.roll.key,
      label: match.instance.label,
      aliases: match.instance.aliases || [],
      cutinKey: contractCutinKey(match.instance),
      mode: '',
      modeLabel: '',
      secret: message.type === 'whisper' || message.type === 'gmrollresult',
    }, message);
    return true;
  }

  function captureResult(message) {
    var content = String((message && message.content) || '');
    var tokenMatch = content.match(/<!--\s*kib_sheet_result\s*=\s*([A-Za-z0-9_-]+)\s*-->/i) ||
      content.match(/\{\{\s*kib_sheet_result\s*=\s*([A-Za-z0-9_-]+)\s*\}\}/i);
    if (tokenMatch) {
      if (own(pendingResults, tokenMatch[1])) {
        var pending = pendingResults[tokenMatch[1]];
        delete pendingResults[tokenMatch[1]];
        emitResult(pending.payload, message);
      }
      return true;
    }
    return captureDirectResult(message);
  }

  function merge(target, source) {
    Object.keys(source || {}).forEach(function (key) {
      target[key] = source[key];
    });
    return target;
  }

  function sendSheet(character, content, payload) {
    prunePendingResults();
    var token = 'k' + Date.now().toString(36) + randomInteger(1000000000).toString(36);
    pendingResults[token] = { created: Date.now(), payload: payload };
    try {
      sendChat('character|' + character.id, content + ' <!--kib_sheet_result=' + token + '-->');
      return { ok: true, payload: payload };
    } catch (err) {
      delete pendingResults[token];
      return { ok: false, error: '판정 메시지를 보내지 못했습니다: ' + (err.message || err) };
    }
  }

  function sourceContractAction(character, query, secret) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'none') return null;
    if (inspection.status === 'ambiguous' && inspection.recognitionReason !== 'source-defaults-ambiguous')
      return { ok: false, error: inspection.error };
    var resolved = resolveContractAction(character, query, secret);
    return resolved.handled
      ? resolved.result
      : { ok: false, error: '현재 시트에서 ' + trim(query) + ' 굴림을 찾지 못했습니다.' };
  }

  function sourceContractNeedsName(character) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'none') return null;
    if (inspection.status === 'ambiguous') return { ok: false, error: inspection.error };
    return { ok: false, error: '시트에서 읽은 굴림은 <code>!!굴릴항목이름</code>으로 실행해 주세요.' };
  }

  function rollCheck(characterId, query, options) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractAction(character, trim(query) + (options && trim(options.mode) ? ' ' + trim(options.mode) : ''), !!(options && options.secret));
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

  function safeRollExpression(expression) {
    var source = trim(expression);
    if (!source || source.length > 100) return null;
    var scrubbed = source.replace(/@\{[A-Za-z0-9_$-]+(?:\|max)?\}/g, '1');
    if (scrubbed.indexOf('@{') > -1) return null;
    var withoutFunctions = scrubbed.replace(/\b(?:floor|ceil|round|min|max|abs)\b/gi, '');
    if (!/^[\d\s+dD*/().,-]+$/.test(withoutFunctions)) return null;
    var dice = scrubbed.match(/(?:\d*)d\d+/gi) || [];
    for (var i = 0; i < dice.length; i++) {
      var match = dice[i].match(/^(\d*)d(\d+)$/i);
      var count = Number(match[1] || 1);
      var sides = Number(match[2]);
      if (count < 1 || count > 100 || sides < 1 || sides > 100000) return null;
    }
    return source;
  }

  function safeUserRollExpression(characterId, expression) {
    var resolved = resolvedRollExpression(characterId, expression, [], 0, {});
    if (!resolved) return null;
    if (!/(^|[^A-Za-z0-9_])(?:\d*)d\d+([^A-Za-z0-9_]|$)/i.test(resolved)) return null;
    var source = resolved.replace(/\s+/g, '');
    var tokens = [];
    while (source) {
      var match = source.match(/^(floor|ceil|round|min|max|abs|\d*d\d+|\d+(?:\.\d+)?|[()+\-*\/,])/i);
      if (!match) return null;
      tokens.push(match[1]);
      source = source.substring(match[1].length);
    }
    var depth = 0;
    var expectingValue = true;
    var unary = false;
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (/^(?:floor|ceil|round|min|max|abs)$/i.test(token)) {
        if (!expectingValue || tokens[i + 1] !== '(') return null;
        continue;
      }
      if (token === '(') {
        if (!expectingValue) return null;
        depth++;
        unary = false;
        continue;
      }
      if (token === ')') {
        if (expectingValue || depth < 1) return null;
        depth--;
        expectingValue = false;
        unary = false;
        continue;
      }
      if (token === ',') {
        if (expectingValue || depth < 1) return null;
        expectingValue = true;
        unary = false;
        continue;
      }
      if (/^[+\-]$/.test(token) && expectingValue) {
        if (unary) return null;
        unary = true;
        continue;
      }
      if (/^[+\-*\/]$/.test(token)) {
        if (expectingValue) return null;
        expectingValue = true;
        unary = false;
        continue;
      }
      if (!expectingValue) return null;
      expectingValue = false;
      unary = false;
    }
    return !expectingValue && depth === 0 ? resolved : null;
  }

  function repeatingScope(name) {
    var match = trim(name).match(/^(repeating_.+_(?:\$\d+|-[A-Za-z0-9_-]+)_)/);
    return match ? [match[1]] : [];
  }

  function expressionAttribute(characterId, name, valueType, scopes, defaults, rowContext) {
    var candidates = [];
    var rowLocal = rowContext && rowContext.fields && own(rowContext.fields, name);
    if (name.indexOf('repeating_') !== 0) {
      (scopes || []).forEach(function (scope) {
        candidates.push({ name: scope + name, scopes: scopes });
      });
    }
    if (!rowLocal) candidates.push({ name: name, scopes: repeatingScope(name) });
    for (var i = 0; i < candidates.length; i++) {
      var valueKey = candidates[i].name + '|' + valueType;
      var resolved = !rowLocal && rowContext && typeof rowContext.resolveAttribute === 'function'
        ? rowContext.resolveAttribute(candidates[i].name, valueType) : undefined;
      var value = rowLocal && rowContext.values && own(rowContext.values, valueKey)
        ? rowContext.values[valueKey]
        : rowLocal ? undefined : resolved !== undefined ? resolved
          : getAttr(characterId, candidates[i].name, valueType);
      if ((value === undefined || trim(value) === '') && defaults && own(defaults, candidates[i].name))
        value = defaults[candidates[i].name];
      if (value !== undefined && trim(value) !== '')
        return { name: candidates[i].name, value: value, scopes: candidates[i].scopes };
    }
    return null;
  }

  function resolvedRollExpression(characterId, expression, scopes, depth, trail, defaults, rowContext) {
    if ((depth || 0) > 8) return null;
    var source = trim(expression);
    if (!source) return null;
    var failed = false;
    source = source.replace(/@\{([A-Za-z0-9_$-]+)(?:\|(max))?\}/g, function (match, name, valueType) {
      var found = expressionAttribute(characterId, name, valueType || 'current', scopes || [], defaults, rowContext);
      if (!found || (trail && trail[found.name])) {
        failed = true;
        return '0';
      }
      var nextTrail = dictionary();
      Object.keys(trail || {}).forEach(function (key) { nextTrail[key] = true; });
      nextTrail[found.name] = true;
      var nested = resolvedRollExpression(
        characterId,
        found.value,
        found.scopes,
        (depth || 0) + 1,
        nextTrail,
        defaults,
        rowContext,
      );
      if (!nested) {
        failed = true;
        return '0';
      }
      return '(' + nested + ')';
    });
    if (failed || source.indexOf('@{') > -1) return null;
    return safeRollExpression(source);
  }

  function rollWeapon(characterId, query, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractAction(character, query, secret);
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

  function showSpell(characterId, query, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractAction(character, query, secret);
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

  function rollArmor(characterId, query, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractAction(character, query, secret);
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

  function rollFree(characterId, secret, expressionOverride) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = expressionOverride !== undefined
      ? executeContractExpression(character, expressionOverride, secret)
      : sourceContractNeedsName(character);
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

 function contractChoice(instance, mode, secret, expression) {
    var modeLabels = mode ? contractUserModeLabels(mode) : [];
    return {
      kind: 'contract',
      characterId: instance.characterId,
      contractId: instance.contract.id,
      rollKey: instance.roll.key,
      rowId: instance.row ? instance.row.id : '',
      modeId: mode ? String(mode.id || '') : '',
      label: (instance.label || '시트 굴림') + (modeLabels.length ? ' / ' + modeLabels[0] : ''),
      secret: !!secret,
      expression: expression || '',
    };
  }

  function contractConflict(instances, secret, expression) {
    var entries = instances.slice(0, 50);
    var choices = entries.map(function (entry) {
      return contractChoice(entry.instance, entry.mode || null, secret, expression);
    });
    var counts = dictionary();
    choices.forEach(function (choice) {
      var key = normalize(choice.label);
      counts[key] = (counts[key] || 0) + 1;
    });
    var used = dictionary();
    choices.forEach(function (choice, index) {
      var key = normalize(choice.label);
      if (counts[key] < 2) return;
      used[key] = (used[key] || 0) + 1;
      choice.label += ' (선택 ' + used[key] + ')';
    });
    return {
      ok: false,
      reason: 'conflict',
      error: '시트 원본에서 맞는 실행 항목이 여러 개입니다.' + (instances.length > choices.length ? ' 먼저 50개만 표시합니다.' : ''),
      choices: choices,
    };
  }

  function replaceContractQueries(source, queries) {
    var value = source;
    var consumed = dictionary();
    (queries || []).filter(function (query) { return !!query.raw; }).sort(function (left, right) {
      return right.raw.length - left.raw.length || left.occurrence - right.occurrence;
    }).forEach(function (query) {
      var used = consumed[query.raw] || 0;
      var wanted = Math.max(1, query.occurrence - used);
      var start = 0;
      var found = -1;
      for (var index = 0; index < wanted; index++) {
        found = value.indexOf(query.raw, start);
        if (found < 0) break;
        start = found + query.raw.length;
      }
      if (found > -1) value = value.slice(0, found) + query.value + value.slice(found + query.raw.length);
      consumed[query.raw] = used + 1;
    });
    var grouped = dictionary();
    (queries || []).filter(function (query) { return !query.raw && query.name; }).forEach(function (query) {
      var key = normalize(query.name);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(query);
    });
    var seen = dictionary();
    return value.replace(/\?\{([^{}]*)\}/g, function (match, content) {
      var key = normalize(trim(content.split('|')[0]));
      seen[key] = (seen[key] || 0) + 1;
      var selected = (grouped[key] || []).filter(function (query) {
        return query.occurrence === seen[key];
      })[0];
      return selected ? selected.value : match;
    });
  }

  function qualifyContractMacro(characterId, instance, mode, expression) {
    var raw = String(instance && instance.roll && instance.roll.raw || '');
    if (!raw || raw.length > 20000) return { ok: false, error: '시트의 굴림 값이 비어 있거나 너무 깁니다.' };
    if (/(^|[\r\n])\s*!/.test(raw)) return { ok: false, error: 'API 명령을 실행하는 시트 굴림은 대신 실행하지 않습니다.' };
    if (/(?:\{\{|<!--)\s*kib_sheet_result\s*=/i.test(raw)) return { ok: false, error: '시트 헬퍼 예약 필드가 들어간 롤은 실행하지 않습니다.' };
    if (/%\{\s*(?:selected|target)\|/i.test(raw))
      return { ok: false, error: 'selected 또는 target이 필요한 롤은 토큰 대상이 없는 API에서 바로 실행할 수 없습니다.' };
    if (mode && !contractOverridesValid(instance.contract, instance.roll, mode))
      return { ok: false, error: '현재 시트의 선택 방식이 굴림에 맞지 않습니다.' };
    var overrides = contractOverrides(mode);
    var expressionRefs = Array.isArray(instance.roll.expressionRefs) ? instance.roll.expressionRefs : [];
    if (expression !== undefined) {
      expressionRefs.forEach(function (ref) {
        var name = contractRefName(ref);
        if (name) overrides[name] = expression;
      });
    }
    raw = replaceContractQueries(raw, contractQueries(mode));
    var runtimeIndex = contractRuntimeIndex(instance.contract);
    var repeating = contractRepeating(instance.roll);
    var sourceFields = repeating && runtimeIndex.fieldSections[repeating.section] || runtimeIndex.fieldGlobal;
    var sourceControls = runtimeIndex.rollControls[instance.roll.key] || runtimeIndex.controls;
    var savedAttributes = null;
    var failed = '';
    var expansions = 0;
    function savedAttribute(name) {
      if (!savedAttributes) {
        savedAttributes = dictionary();
        (attributeObjectCache[characterId] || attrObjects(characterId)).forEach(function (attribute) {
          savedAttributes[trim(attribute.get('name'))] = attribute;
        });
      }
      return savedAttributes[name] || null;
    }
    function sourceValue(name, maximum) {
      var field = sourceFields[name] || runtimeIndex.fieldGlobal[name];
      var value = field && field[maximum ? 'max' : 'default'];
      if ((value === undefined || value === null || trim(value) === '') && !maximum) {
        var control = sourceControls[name] || runtimeIndex.controls[name];
        value = control && control.default;
      }
      if ((value === undefined || value === null || trim(value) === '') && !maximum && field && field.type === 'checkbox')
        value = '0';
      return value === undefined || value === null || trim(value) === '' ? null : String(value);
    }
    function missingValueError(name) {
      var field = sourceFields[name] || runtimeIndex.fieldGlobal[name];
      var label = field && userFacingField(field) ? fieldLabel(field, '') : '';
      var rollLabel = contractDisplayLabel(instance.label) || '선택한';
      return label && normalize(label) !== normalize(rollLabel)
        ? rollLabel + ' 굴림에 필요한 ' + label + ' 값이 비어 있습니다.'
        : rollLabel + ' 굴림에 필요한 수치가 비어 있습니다.';
    }
    function expand(fragment, depth, trail, required) {
      if (failed) return '';
      if (depth > 12) {
        failed = '시트 항목 연결이 너무 깊습니다.';
        return '';
      }
      var source = String(fragment);
      if (source.length > 20000) {
        failed = '확장된 시트 롤이 너무 깁니다.';
        return '';
      }
      var expanded = source.replace(/@\{([^{}]+)\}/g, function (match, body, offset) {
        if (failed) return '';
        if (++expansions > 512) {
          failed = '시트 항목 연결이 너무 복잡합니다.';
          return '';
        }
        var parts = body.split('|').map(trim);
        var keyword = normalize(parts[0]);
        if (keyword === 'selected' || keyword === 'target') {
          failed = 'selected 또는 target이 필요한 롤은 토큰 대상이 없는 API에서 바로 실행할 수 없습니다.';
          return '';
        }
        var local = parts.length === 1 || (parts.length === 2 && normalize(parts[1]) === 'max');
        if (!local) {
          failed = '현재 캐릭터 외 속성을 참조하는 롤은 실행하지 않습니다.';
          return '';
        }
        var name = parts[0];
        var maximum = parts.length === 2;
        var requiredHere = required || source.lastIndexOf('[[', offset) > source.lastIndexOf(']]', offset);
        if (!maximum && own(overrides, name)) {
          if (requiredHere && trim(overrides[name]) === '') {
            failed = missingValueError(name);
            return '';
          }
          if (trail[name]) {
            failed = '시트 항목 연결이 순환합니다: ' + name;
            return '';
          }
          var nextTrail = dictionary();
          Object.keys(trail).forEach(function (key) { nextTrail[key] = true; });
          nextTrail[name] = true;
          return expand(overrides[name], depth + 1, nextTrail, requiredHere);
        }
        var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
        var stored = savedAttribute(fullName);
        var sourceField = sourceFields[name] || runtimeIndex.fieldGlobal[name];
        var visibleDefault = !stored && sourceField && sourceField.numericCandidate &&
          !sourceField.hidden && !sourceField.readonly && !sourceField.disabled
          ? sourceValue(name, maximum) : null;
        var live = stored ? null : getAttr(characterId, fullName, maximum ? 'max' : 'current');
        var actual = stored ? stored.get(maximum ? 'max' : 'current')
          : visibleDefault !== null && !maximum
            ? contractUnsavedFieldValue(sourceField, live, visibleDefault, false)
            : live;
        if (actual !== undefined && actual !== null && trim(actual) !== '' && /@\{[^{}]+\}/.test(String(actual))) {
          var attrKey = 'attr|' + fullName + '|' + (maximum ? 'max' : 'current');
          if (trail[attrKey]) {
            failed = '시트 항목 연결이 순환합니다: ' + fullName;
            return '';
          }
          var attrTrail = dictionary();
          Object.keys(trail).forEach(function (key) { attrTrail[key] = true; });
          attrTrail[attrKey] = true;
          return expand(actual, depth + 1, attrTrail, requiredHere);
        }
        if (actual !== undefined && actual !== null && trim(actual) !== '') return String(actual);
        if (stored) {
          var savedField = sourceFields[name] || runtimeIndex.fieldGlobal[name];
          if (savedField && savedField.type === 'checkbox') return '0';
          if (!savedField || !savedField.hidden) {
            if (requiredHere) failed = missingValueError(name);
            return '';
          }
        }
        var fallback = sourceValue(name, maximum);
        if (fallback !== null) {
          var fallbackKey = 'default|' + fullName + '|' + (maximum ? 'max' : 'current');
          if (trail[fallbackKey]) {
            failed = '시트 항목 연결이 순환합니다: ' + fullName;
            return '';
          }
          var fallbackTrail = dictionary();
          Object.keys(trail).forEach(function (key) { fallbackTrail[key] = true; });
          fallbackTrail[fallbackKey] = true;
          return expand(fallback, depth + 1, fallbackTrail, requiredHere);
        }
        if (requiredHere) failed = missingValueError(name);
        return '';
      });
      if (expanded.length > 20000) {
        failed = '확장된 시트 롤이 너무 깁니다.';
        return '';
      }
      return expanded;
    }
    var content = expand(raw, 0, {}, false);
    if (failed) return { ok: false, error: failed };
    if (!content || content.length > 20000) return { ok: false, error: '확장된 시트 롤이 비어 있거나 너무 깁니다.' };
    if (/(^|[\r\n])\s*!/.test(content) || /%\{[^{}]+\}/.test(content))
      return { ok: false, error: '다른 능력 또는 API 명령을 불러오는 롤은 안전하게 재생할 수 없습니다.' };
    if (/(?:\{\{|<!--)\s*kib_sheet_result\s*=/i.test(content)) return { ok: false, error: '시트 헬퍼 예약 필드가 들어간 롤은 실행하지 않습니다.' };
    if (content.indexOf('?{') > -1)
      return { ok: false, reason: 'query', error: '이 굴림은 시트에서 고르는 값이 더 필요합니다.' };
    return { ok: true, content: content };
  }

  function currentContractModes(characterId, instance) {
    var index = contractRuntimeIndex(instance.contract);
    var controls = index.rollControls[instance.roll.key] || index.controls;
    return (instance.modes || []).filter(function (mode) {
      var overrides = contractOverrides(mode);
      return Object.keys(overrides).every(function (name) {
        var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
        var current = getAttr(characterId, fullName);
        var control = controls[name];
        if ((current === undefined || current === null || String(current) === '') && control && own(control, 'default'))
          current = control.default;
        return current === undefined || current === null || String(current) === String(overrides[name]);
      });
    });
  }

  function executeContractInstance(character, instance, modeId, secret, expression, modeLabelOverride) {
    instance.characterId = character.id;
    var modes = instance.modes || [];
    var mode = null;
    if (modeId) {
      var matchingModes = modes.filter(function (candidate) { return String(candidate.id || '') === String(modeId); });
      if (matchingModes.length !== 1)
        return { ok: false, error: '선택한 굴림 방식이 바뀌었습니다. 항목을 다시 선택해 주세요.' };
      mode = matchingModes[0];
    }
    var qualified = qualifyContractMacro(character.id, instance, mode, expression);
    if (!qualified.ok) {
      if (qualified.reason === 'query' && !mode && modes.length) {
        var choices = currentContractModes(character.id, instance).filter(function (candidate) {
          return contractQueries(candidate).length > 0;
        });
        if (choices.length === 1)
          return executeContractInstance(character, instance, choices[0].id, secret, expression, modeLabelOverride);
        if (choices.length > 1)
          return contractConflict(choices.map(function (candidate) { return { instance: instance, mode: candidate }; }), secret, expression);
        return { ok: false, error: '현재 시트에서 같은 굴림 방식을 찾지 못했습니다.' };
      }
      return qualified;
    }
    var label = instance.label;
    var modeLabels = mode ? contractUserModeLabels(mode) : [];
    var content = qualified.content;
    var system = 'sheet';
    if (secret && !/^\s*\/(?:w|gmroll)\b/i.test(content)) content = '/w gm ' + content;
    var payload = {
      source: 'helper',
      system: system,
      kind: instance.roll.kind || 'contract',
      characterId: character.id,
      contractId: instance.contract.id,
      sourceHash: instance.contract.sourceHash || '',
      key: instance.roll.key,
      label: label,
      aliases: instance.aliases || [],
      cutinKey: contractCutinKey(instance),
      mode: mode ? String(mode.id || '') : normalize(modeLabelOverride),
      modeLabel: trim(modeLabelOverride) || modeLabels[0] || '',
      secret: !!secret,
    };
    if (/&\{\s*template\s*:/i.test(content)) return sendSheet(character, content, payload);
    try {
      sendChat('character|' + character.id, content);
      payload.resultTracking = false;
      return { ok: true, payload: payload };
    } catch (err) {
      return { ok: false, error: '시트 롤을 보내지 못했습니다: ' + (err.message || err) };
    }
  }

  function exactContractInstance(characterId, contractId, rollKey, rowId, includeHidden) {
    var inspection = inspectContracts(characterId);
    if (inspection.status !== 'matched' &&
        !(inspection.status === 'ambiguous' && inspection.recognitionReason === 'source-defaults-ambiguous'))
      return { ok: false, error: inspection.error || SHEET_NOT_RECOGNIZED };
    var allowed = inspection.status === 'matched'
      ? [inspection.contract.id]
      : (inspection.matches || []).map(function (match) { return match.id; });
    if (allowed.indexOf(String(contractId)) < 0)
      return { ok: false, error: '선택한 굴림 정보가 현재 캐릭터와 더 이상 맞지 않습니다.' };
    var matches = actionableContractRolls(characterId, inspection, !!includeHidden).filter(function (instance) {
      return String(instance.contract.id) === String(contractId) &&
        String(instance.roll.key) === String(rollKey) && String(instance.row ? instance.row.id : '') === String(rowId || '');
    });
    return matches.length === 1
      ? { ok: true, instance: matches[0] }
      : { ok: false, error: '선택한 굴림 또는 반복행이 바뀌었습니다.' };
  }

  function contractExpressionRef(characterId, instance) {
    var refs = instance && instance.roll && Array.isArray(instance.roll.expressionRefs)
      ? instance.roll.expressionRefs : [];
    if (refs.length !== 1) return '';
    var name = contractRefName(refs[0]);
    var control = contractControls(instance.contract, instance.roll).filter(function (candidate) {
      return contractControlName(candidate) === name;
    })[0];
    var type = trim(control && control.type).toLowerCase();
    if (!name || (type !== 'text' && type !== 'textarea')) return '';
    var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
    var value = getAttr(characterId, fullName);
    if ((value === undefined || value === null || String(value) === '') && control && own(control, 'default'))
      value = control.default;
    value = trim(value);
    if (value && !safeUserRollExpression(characterId, value)) return '';
    return name;
  }

  function executeContract(characterId, contractId, rollKey, rowId, modeId, secret, expressionText) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var exact = exactContractInstance(characterId, contractId, rollKey, rowId, !!modeId);
    if (!exact.ok) return exact;
    var expression;
    if (expressionText !== undefined && expressionText !== '') {
      if (!contractExpressionRef(characterId, exact.instance))
        return { ok: false, error: '선택한 굴림은 자유 주사위 식을 받지 않습니다.' };
      expression = safeUserRollExpression(characterId, expressionText);
      if (!expression) return { ok: false, error: '자유 주사위 식은 2d6+3처럼 완전한 식으로 적어 주세요.' };
    }
    return executeContractInstance(character, exact.instance, modeId, secret, expression);
  }

  function contractInstanceAliases(instance, compatible, primaryOnly) {
    var found = dictionary();
    var result = [];
    var labels = primaryOnly ? [instance.label,
      trim(instance.label).replace(/\s*[（(][^()（）]*\d[^()（）]*[)）]\s*$/, '')] : instance.aliases || [];
    labels.forEach(function (value) {
      contractLookupKeys(value, compatible).forEach(function (key) {
        if (!found[key]) {
          found[key] = true;
          result.push(key);
        }
      });
    });
    return result;
  }

  function contractLookupKeys(value, compatible) {
    var key = normalize(value);
    if (!key) return [];
    if (compatible === false) return [key];
    var canonical = key.replace(/페널티/g, '패널티')
      .replace(/(?:주사위|dice)/g, '')
      .replace(/(\d)개/g, '$1')
      .replace(/개(?=\d)/g, '');
    return canonical === key || !canonical ? [key] : [key, canonical];
  }

  function contractModeCandidates(instance, compatible, primaryOnly) {
    var actionAliases = contractInstanceAliases(instance, compatible, primaryOnly);
    var result = [];
    (instance.modes || []).forEach(function (mode) {
      var modeAliases = [];
      contractUserModeLabels(mode).forEach(function (label) {
        modeAliases = modeAliases.concat(contractLookupKeys(label, compatible));
      });
      var combined = [];
      actionAliases.forEach(function (action) {
        modeAliases.forEach(function (modeAlias) { combined.push(action + modeAlias); });
      });
      result.push({ instance: instance, mode: mode, modeValues: modeAliases,
        exactValues: modeAliases.concat(combined), partialValues: combined });
    });
    return result;
  }

  function contractKeysMatch(values, wanted, partial) {
    return values.some(function (value) {
      return wanted.some(function (key) {
        return partial ? value.indexOf(key) > -1 : value === key;
      });
    });
  }

  function contractMatchRank(values, wanted) {
    var best = 3;
    values.forEach(function (value) {
      wanted.forEach(function (key) {
        if (value === key) best = 0;
        else if (best > 1 && value.indexOf(key) === 0) best = 1;
        else if (best > 2 && value.indexOf(key) > -1) best = 2;
      });
    });
    return best;
  }

  function closestContractActions(instances, query, includeHidden) {
    var wanted = contractLookupKeys(query, true);
    var best = 12;
    var found = [];
    instances.forEach(function (instance) {
      if (instance.hidden && !includeHidden) return;
      var rank = contractMatchRank(contractInstanceAliases(instance, true), wanted) * 4 +
        contractMatchRank(contractInstanceAliases(instance, true, true), wanted);
      if (rank < best) {
        best = rank;
        found = [instance];
      } else if (rank === best) found.push(instance);
    });
    return best < 12 ? found : [];
  }

  function uniqueContractCandidates(candidates) {
    var found = dictionary();
    return candidates.filter(function (candidate) {
      var key = candidate.instance.contract.id + '|' + candidate.instance.key + '|' +
        String(candidate.mode && candidate.mode.id || '');
      if (found[key]) return false;
      found[key] = true;
      return true;
    });
  }

  function contractBehaviorContent(value, instance) {
    var content = String(value);
    var identityFields = dictionary();
    (instance.roll.labelRefs || []).concat(instance.roll.staticLabels || []).forEach(function (entry) {
      var field = trim(entry && entry.field);
      if (field) identityFields[field] = true;
    });
    Object.keys(identityFields).forEach(function (field) {
      var escaped = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      content = content.replace(new RegExp('(\\{\\{\\s*' + escaped + '\\s*=)[^}]*(\\}\\})', 'gi'), '$1*$2');
    });
    return content.replace(/\[\[([\s\S]*?)\]\]/g, function (token, expression) {
      return '[[' + expression.replace(
        /(\b\d*d(?:\d+|%|f))(?:c[fs](?:[<>=]?[-+]?\d+(?:\.\d+)?)?)+/gi,
        '$1',
      ) + ']]';
    }).replace(/\r\n?/g, '\n').trim();
  }

  function contractCandidateEquivalenceKey(characterId, candidate, expression) {
    var instance = candidate.instance;
    var mode = candidate.mode || null;
    function normalized(values) {
      return (values || []).map(normalize).filter(Boolean).sort();
    }
    function qualifiedSignature(selectedMode) {
      var qualified = qualifyContractMacro(characterId, instance, selectedMode, expression);
      return qualified.ok
        ? ['ok', contractBehaviorContent(qualified.content, instance)]
        : ['error', qualified.reason || '', qualified.error || ''];
    }
    var modeSignatures = mode ? [] : (instance.modes || []).map(function (availableMode) {
      return [normalized(contractUserModeLabels(availableMode)), qualifiedSignature(availableMode)];
    }).sort(function (left, right) {
      return JSON.stringify(left).localeCompare(JSON.stringify(right));
    });
    var resultTemplate = sourceResultTemplateForContract(instance.contract, instance.roll.key);
    return JSON.stringify([
        normalize(instance.label),
        instance.row ? instance.row.id : '',
        instance.roll.kind || 'contract',
        mode ? normalized(contractUserModeLabels(mode)) : modeSignatures,
        qualifiedSignature(mode),
        resultTemplate || null,
        !!instance.hidden,
      ]);
  }

  function collapseEquivalentContractCandidates(characterId, candidates, expression) {
    if (candidates.length < 2) return candidates;
    var copies = dictionary();
    candidates = candidates.filter(function (candidate) {
      var instance = candidate.instance;
      var roll = instance.roll || {};
      var labels = contractStaticLabels(roll);
      var labelKey = normalize(trim(instance.label).replace(/\s*[（(][^()（）]*\d[^()（）]*[)）]\s*$/, ''));
      if (!labels.length || !roll.raw || !labels.some(function (label) {
        return normalize(label) === labelKey;
      })) return true;
      // 같은 행의 동일 출력/식 복제 버튼만 합치며 원본 계약과 키는 그대로 둡니다.
      var key = JSON.stringify([
        instance.contract.id, instance.row ? instance.row.id : '', roll.repeating || null,
        labelKey, labels, roll.raw, roll.refs || [], roll.expressionRefs || [], roll.modes || [],
        instance.hidden ? roll.visibility || null : null, !!instance.hidden, roll.kind || '', candidate.mode || null,
        roll.template || '',
      ]);
      if (copies[key]) return false;
      copies[key] = true;
      return true;
    });
    var firstContractId = candidates[0].instance.contract.id;
    if (candidates.every(function (candidate) {
      return candidate.instance.contract.id === firstContractId;
    })) return candidates;
    var found = dictionary();
    return candidates.filter(function (candidate) {
      var key = contractCandidateEquivalenceKey(characterId, candidate, expression);
      if (found[key]) return false;
      found[key] = true;
      return true;
    });
  }

  function commonContractRolls(characterId, inspection, includeHidden, objects, readLive) {
    if (inspection && inspection.status === 'matched')
      return contractRolls(characterId, inspection, objects, includeHidden, readLive);
    var candidates = sourceCandidateInspections(inspection);
    if (!candidates.length) return [];
    var groups = dictionary();
    actionableContractRolls(characterId, inspection, includeHidden, objects, readLive).forEach(function (instance) {
      var key = contractCandidateEquivalenceKey(characterId, { instance: instance });
      if (!groups[key]) groups[key] = instance;
    });
    return Object.keys(groups).map(function (key) { return groups[key]; });
  }

  function preferDirectContractActions(instances, compatible) {
    var grouped = dictionary();
    instances.forEach(function (instance) {
      var id = instance.contract.id;
      if (!grouped[id]) grouped[id] = [];
      grouped[id].push(instance);
    });
    var contractIds = Object.keys(grouped);
    if (contractIds.length > 1) {
      var result = [];
      contractIds.forEach(function (id) {
        result = result.concat(preferDirectContractActions(grouped[id], compatible));
      });
      return result;
    }
    var direct = instances.filter(function (instance) {
      return String(instance && instance.roll && instance.roll.raw || '').indexOf('?{') < 0;
    });
    var variants = instances.filter(function (instance) {
      return String(instance && instance.roll && instance.roll.raw || '').indexOf('?{') > -1;
    });
    var addressable = variants.length && variants.every(function (instance) {
      return contractModeCandidates(instance, compatible).some(function (candidate) {
        return candidate.partialValues.length > 0;
      });
    });
    return direct.length && addressable ? direct : instances;
  }

  function preferLeastOverrideModes(candidates) {
    if (candidates.length < 2) return candidates;
    var minimum = dictionary();
    candidates.forEach(function (candidate) {
      var key = candidate.instance.contract.id + '|' + candidate.instance.key;
      var count = Object.keys(contractOverrides(candidate.mode)).length;
      if (!own(minimum, key) || count < minimum[key]) minimum[key] = count;
    });
    return candidates.filter(function (candidate) {
      var key = candidate.instance.contract.id + '|' + candidate.instance.key;
      return Object.keys(contractOverrides(candidate.mode)).length === minimum[key];
    });
  }

  function contractModeContext(mode) {
    var found = dictionary();
    var labels = Array.isArray(mode && mode.labelPath)
      ? mode.labelPath
      : [mode && (mode.labelPath || mode.label)];
    labels.forEach(function (label) {
      String(label).split(/\s*(?:\|\||::|[|｜/>])\s*/).forEach(function (part) {
        var key = normalize(part);
        if (key) found[key] = true;
      });
    });
    return found;
  }

  function preferCurrentModeContext(characterId, candidates) {
    if (candidates.length < 2 || candidates.some(function (candidate) { return !candidate.mode; })) return candidates;
    function contextKey(candidate) {
      var rowId = candidate.instance.row ? candidate.instance.row.id : '';
      return candidate.instance.contract.id + '|' + candidate.instance.roll.key + '|' + rowId + '|' +
        Object.keys(contractOverrides(candidate.mode)).sort().join(',');
    }
    var sharedKey = contextKey(candidates[0]);
    if (candidates.some(function (candidate) { return contextKey(candidate) !== sharedKey; })) return candidates;
    var best = 0;
    var overrideKey = Object.keys(contractOverrides(candidates[0].mode)).sort().join(',');
    var currentModes = currentContractModes(characterId, candidates[0].instance).filter(function (mode) {
      return Object.keys(contractOverrides(mode)).sort().join(',') === overrideKey;
    });
    if (!currentModes.length) return candidates;
    var current = currentModes.map(contractModeContext);
    var ranked = candidates.map(function (candidate) {
      var wanted = contractModeContext(candidate.mode);
      var score = 0;
      current.forEach(function (currentLabels) {
        var overlap = Object.keys(wanted).filter(function (key) { return currentLabels[key]; }).length;
        if (overlap > score) score = overlap;
      });
      if (score > best) best = score;
      return { candidate: candidate, score: score };
    });
    return best ? ranked.filter(function (entry) { return entry.score === best; })
      .map(function (entry) { return entry.candidate; }) : candidates;
  }

  function contractMultipleRollRequest(query) {
    var matched = trim(query).match(
      /^(.+?)\s*((?:보너스|페널티|패널티)\s*(?:1|2|한\s*개|두\s*개)|bonus\s*[12]|penalty\s*[12])$/i,
    );
    return matched ? { base: trim(matched[1]), mode: trim(matched[2]) } : null;
  }

  function contractRollStructure(instance) {
    var raw = String(instance && instance.roll && instance.roll.raw || '');
    var index = contractRuntimeIndex(instance.contract);
    var repeating = contractRepeating(instance.roll);
    var fields = repeating && index.fieldSections[repeating.section] || index.fieldGlobal;
    return raw.replace(/@\{([^{}|]+)\}/g, function (reference, name) {
      var field = fields[name] || index.fieldGlobal[name];
      if (!field) return reference;
      var value = instance.characterId
        ? getAttr(instance.characterId, contractRowAttr(instance.contract, instance.roll, instance.row, name)) : null;
      if (value === undefined || value === null || trim(value) === '') value = field.default;
      if (!/[&?]\{|\{\{/.test(String(value || ''))) return reference;
      var fragment = Object.assign({}, instance, { roll: Object.assign({}, instance.roll, { raw: reference }) });
      var qualified = qualifyContractMacro(instance.characterId, fragment);
      return qualified.ok ? qualified.content : reference;
    });
  }

  function contractInlineRollCount(instance) {
    var fields = dictionary();
    contractRollStructure(instance).replace(
      /\{\{\s*(roll\d*)\s*=\s*\[\[/gi,
      function (match, field) {
        fields[String(field).toLowerCase()] = true;
        return match;
      },
    );
    return Object.keys(fields).length;
  }

  function preferSingleInlineRollActions(candidates) {
    if (candidates.length < 2) return candidates;
    var groups = dictionary();
    candidates.forEach(function (candidate) {
      if (candidate.mode) return;
      var instance = candidate.instance;
      var roll = instance.roll || {};
      var structure = contractRollStructure(instance);
      var baseRaw = structure
        .replace(/&\{template:[^}]+\}/gi, '&{template:*}')
        .replace(/\{\{\s*roll(?:[2-9]\d*)\s*=\s*\[\[[\s\S]*?\]\]\s*\}\}/gi, '')
        .replace(/\s+/g, ' ').trim();
      var key = JSON.stringify([
        instance.contract.id,
        instance.row ? instance.row.id : '',
        normalize(instance.label),
        roll.visibility || null,
        roll.repeating || null,
        (roll.refs || []).filter(function (ref) {
          return structure.indexOf('@{' + contractRefName(ref) + (ref.max ? '|max' : '') + '}') > -1;
        }),
        roll.expressionRefs || [],
        roll.modes || [],
        baseRaw,
      ]);
      if (!groups[key]) groups[key] = [];
      groups[key].push(candidate);
    });
    var chosen = dictionary();
    Object.keys(groups).forEach(function (key) {
      var group = groups[key];
      var counts = group.map(function (candidate) { return contractInlineRollCount(candidate.instance); });
      var minimum = Math.min.apply(Math, counts);
      var maximum = Math.max.apply(Math, counts);
      var best = group.filter(function (candidate) {
        return contractInlineRollCount(candidate.instance) === minimum;
      });
      if (minimum < 1 || minimum === maximum || best.length !== 1) return;
      group.forEach(function (candidate) {
        chosen[candidate.instance.contract.id + '|' + candidate.instance.key] = best[0];
      });
    });
    var seen = dictionary();
    var result = [];
    candidates.forEach(function (candidate) {
      var replacement = chosen[candidate.instance.contract.id + '|' + candidate.instance.key] || candidate;
      var key = replacement.instance.contract.id + '|' + replacement.instance.key + '|' +
        String(replacement.mode && replacement.mode.id || '');
      if (seen[key]) return;
      seen[key] = true;
      result.push(replacement);
    });
    return result;
  }

  function preferVisibleContractCandidates(candidates) {
    var visible = candidates.filter(function (candidate) {
      var instance = candidate.instance || candidate;
      return !instance.hidden;
    });
    return visible.length ? visible : candidates;
  }

  function contractMultipleRollCandidates(instances, query) {
    var requested = contractMultipleRollRequest(query);
    if (!requested) return [];
    var grouped = dictionary();
    instances.forEach(function (instance) {
      var id = instance.contract.id;
      if (!grouped[id]) grouped[id] = [];
      grouped[id].push(instance);
    });
    var contractIds = Object.keys(grouped);
    if (contractIds.length > 1) {
      var result = [];
      contractIds.forEach(function (id) {
        result = result.concat(contractMultipleRollCandidates(grouped[id], query));
      });
      return uniqueContractCandidates(result);
    }
    var matched = closestContractActions(instances, requested.base, true);
    if (!matched.length) return [];
    var wantedMode = contractLookupKeys(requested.mode, true);
    var modes = [];
    matched.forEach(function (instance) {
      modes = modes.concat(contractModeCandidates(instance, true).filter(function (candidate) {
        return contractKeysMatch(candidate.exactValues, wantedMode, false);
      }));
    });
    modes = preferLeastOverrideModes(uniqueContractCandidates(modes));
    if (modes.length) return modes;
    if (matched.length < 2) return [];
    var counts = matched.map(contractInlineRollCount);
    var maximum = Math.max.apply(Math, counts);
    var minimum = Math.min.apply(Math, counts);
    if (maximum < 2 || maximum === minimum) return [];
    return uniqueContractCandidates(matched.filter(function (instance) {
      return contractInlineRollCount(instance) === maximum;
    }).map(function (instance) { return { instance: instance, requestedMode: requested.mode }; }));
  }

  function resolveContractAction(character, query, secret, options) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'ambiguous' && inspection.recognitionReason !== 'source-defaults-ambiguous')
      return { handled: true, result: { ok: false, error: inspection.error } };
    if (inspection.status !== 'matched' && inspection.recognitionReason !== 'source-defaults-ambiguous')
      return { handled: false, result: null };
    var instances = actionableContractRolls(character.id, inspection, true).map(function (instance) {
      instance.characterId = character.id;
      return instance;
    });
    function exactCandidates(compatible) {
      var wanted = contractLookupKeys(query, compatible);
      var primary = instances.filter(function (instance) {
        return !instance.hidden && contractKeysMatch(contractInstanceAliases(instance, compatible, true), wanted, false) ||
          contractModeCandidates(instance, compatible, true).some(function (candidate) {
            return contractKeysMatch(candidate.partialValues, wanted, false);
          });
      });
      var matching = primary.length ? primary : instances;
      var modes = [];
      matching.forEach(function (instance) { modes = modes.concat(contractModeCandidates(instance, compatible)); });
      var exactModes = preferLeastOverrideModes(uniqueContractCandidates(modes.filter(function (candidate) {
        return contractKeysMatch(primary.length ? candidate.partialValues : candidate.exactValues, wanted, false);
      })));
      var exactActions = preferDirectContractActions(matching.filter(function (instance) {
        return !instance.hidden && contractKeysMatch(contractInstanceAliases(instance, compatible), wanted, false);
      }), compatible);
      return preferCurrentModeContext(character.id,
        uniqueContractCandidates(exactModes.concat(exactActions.map(function (instance) { return { instance: instance }; }))));
    }
    var exact = exactCandidates(false);
    if (!exact.length) exact = exactCandidates(true);
    exact = collapseEquivalentContractCandidates(character.id, preferSingleInlineRollActions(exact));
    if (!contractLookupKeys(query, true).length) return { handled: false, result: null };
    if (exact.length === 1)
      return { handled: true, result: executeContractInstance(character, exact[0].instance, exact[0].mode ? exact[0].mode.id : '', secret) };
    var deferredModeConflict = exact.length > 1 && exact.every(function (candidate) { return !!candidate.mode; })
      ? exact : [];
    if (exact.length > 1 && !deferredModeConflict.length)
      return { handled: true, result: contractConflict(exact, secret) };
    var multipleRoll = collapseEquivalentContractCandidates(
      character.id,
      preferVisibleContractCandidates(contractMultipleRollCandidates(instances, query)),
    );
    if (multipleRoll.length === 1)
      return { handled: true, result: executeContractInstance(character, multipleRoll[0].instance,
        multipleRoll[0].mode ? multipleRoll[0].mode.id : '', secret, undefined, multipleRoll[0].requestedMode) };
    if (multipleRoll.length > 1) return { handled: true, result: contractConflict(multipleRoll, secret) };
    if (options && options.exactOnly) return { handled: false, result: null, inspection: inspection };
    var wanted = contractLookupKeys(query, true);
    var partialActions = preferDirectContractActions(preferVisibleContractCandidates(
      closestContractActions(instances, query),
    ), true);
    var partialActionRank = partialActions.length
      ? contractMatchRank(contractInstanceAliases(partialActions[0], true), wanted)
      : 3;
    var partial;
    if (partialActions.length) {
      partial = uniqueContractCandidates(partialActions.map(function (instance) { return { instance: instance }; }));
    } else {
      var modes = [];
      instances.forEach(function (instance) { modes = modes.concat(contractModeCandidates(instance, true)); });
      var directModes = modes.filter(function (candidate) {
        return contractKeysMatch(candidate.modeValues, wanted, true);
      });
      var matchingModes = directModes.length ? directModes : modes.filter(function (candidate) {
        return contractMatchRank(candidate.partialValues, wanted) < 2;
      });
      partial = preferLeastOverrideModes(uniqueContractCandidates(matchingModes));
    }
    partial = preferCurrentModeContext(character.id, partial);
    partial = collapseEquivalentContractCandidates(character.id, preferSingleInlineRollActions(partial));
    if (partial.length === 1 && (!deferredModeConflict.length || partialActionRank === 1))
      return { handled: true, result: executeContractInstance(character, partial[0].instance, partial[0].mode ? partial[0].mode.id : '', secret) };
    if (deferredModeConflict.length)
      return { handled: true, result: contractConflict(deferredModeConflict, secret) };
    if (partial.length > 1) return { handled: true, result: contractConflict(partial, secret) };
    var roleNames = Object.keys(DETECTED_ROLE_LABELS).filter(function (role) {
      return role !== 'characteristic' && (DETECTED_ROLE_LABELS[role] || []).indexOf(normalize(query)) > -1;
    });
    if (roleNames.length === 1) {
      var detected = detectedRollRole(scan(character.id), roleNames[0]);
      if (detected.item)
        return { handled: true, result: executeContractInstance(character, detected.item, '', secret) };
    }
    return { handled: false, result: null, inspection: inspection };
  }

  function executeContractExpression(character, expressionText, secret) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'ambiguous' && inspection.recognitionReason !== 'source-defaults-ambiguous')
      return { ok: false, error: inspection.error };
    if (inspection.status !== 'matched' && inspection.recognitionReason !== 'source-defaults-ambiguous') return null;
    var safe = safeUserRollExpression(character.id, expressionText);
    if (!safe) return { ok: false, error: '자유 주사위 식은 2d6+3처럼 완전한 식으로 적어 주세요.' };
    var instances = actionableContractRolls(character.id, inspection, false).filter(function (instance) {
      return !!contractExpressionRef(character.id, instance);
    }).map(function (instance) {
      instance.characterId = character.id;
      return instance;
    });
    if (!instances.length) return { ok: false, error: '현재 시트에는 식을 바꿔 굴릴 수 있는 항목이 없습니다.' };
    instances = collapseEquivalentContractCandidates(character.id, instances.map(function (instance) {
      return { instance: instance };
    }), safe).map(function (candidate) { return candidate.instance; });
    if (instances.length > 1)
      return contractConflict(instances.map(function (instance) { return { instance: instance }; }), secret, expressionText);
    return executeContractInstance(character, instances[0], '', secret, safe);
  }

  function sortedUnique(values) {
    var seen = dictionary();
    return (values || []).map(trim).filter(function (value) {
      var key = normalize(value);
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    }).sort(function (left, right) { return left.localeCompare(right); });
  }

  var ROLL_STATUS_GROUPS = [
    { key: 'characteristic', title: '특성치' },
    { key: 'check', title: '기능 / 판정' },
    { key: 'combat', title: '무기' },
    { key: 'spell', title: '주문' },
    { key: 'madness', title: '광기' },
    { key: 'other', title: '기타 주사위' },
  ];

  function rollStatusContext(instance) {
    var roll = instance && instance.roll || {};
    var groups = [];
    var labels = contractStaticLabels(roll).concat(roll.aliases || []);
    var sourceRaw = contractRollStructure(instance);
    var structure = [roll.template].concat(sourceTemplateFieldNames(sourceRaw));
    var repeating = contractRepeating(roll);
    if (repeating && instance && instance.contract) {
      var index = contractRuntimeIndex(instance.contract);
      var fields = index.fieldSections[repeating.section] || dictionary();
      contractRollFields(instance.contract, roll, index.controls).forEach(function (name) {
        var field = fields[name];
        if (!field) return;
        groups.push(field.groupLabel);
        structure.push(field.label);
        structure = structure.concat(field.aliases || []);
      });
    }
    return {
      sourceRaw: sourceRaw,
      groups: sortedUnique(groups.map(contractDisplayLabel).filter(Boolean)),
      labels: sortedUnique(labels.map(contractDisplayLabel).filter(Boolean)),
      structure: sortedUnique(structure.map(trim).filter(Boolean)),
    };
  }

  function rollStatusMatches(labels, pattern) {
    return (labels || []).some(function (label) { return pattern.test(trim(label)); });
  }

  function rollStatusLabel(instance) {
    var roll = instance && instance.roll || {};
    var rollName = normalize(roll.name);
    var rollKey = normalize(roll.key);
    var sourceLabels = contractStaticLabels(roll).map(normalize);
    return [instance && instance.label].concat(instance && instance.aliases || []).map(contractDisplayLabel).filter(function (label) {
      var key = normalize(label);
      return key && (key !== rollName && key !== rollKey || sourceLabels.indexOf(key) > -1);
    })[0] || '';
  }

  function rollHasOutcomeStructure(item) {
    var roll = item && item.roll || {};
    var resultTemplates = item && item.contract && item.contract.resultTemplates;
    var template = resultTemplates && resultTemplates[roll.template];
    if (!template || !Array.isArray(template.rules)) return false;
    var sourceFields = dictionary();
    function addFields(raw) {
      sourceTemplateFieldNames(raw).forEach(function (name) { sourceFields[name] = true; });
    }
    addFields(item.sourceRaw || roll.raw);
    (roll.modes || []).forEach(function (mode) {
      var overrides = contractOverrides(mode);
      Object.keys(overrides).forEach(function (name) { addFields(overrides[name]); });
      contractQueries(mode).forEach(function (query) {
        addFields(query.raw);
        addFields(query.value);
      });
    });
    var matched = dictionary();
    template.rules.forEach(function (rule) {
      if (!rule || !rule.outcome) return;
      var refs = [rule.valueField];
      (rule.conditions || []).forEach(function (condition) { refs = refs.concat(condition.args || []); });
      refs.forEach(function (name) {
        name = trim(name).toLowerCase();
        if (sourceFields[name]) matched[name] = true;
      });
    });
    return Object.keys(matched).length > 1;
  }

  function rollHasPercentileThreshold(item) {
    var raw = String(item && (item.sourceRaw || item.roll && item.roll.raw) || '');
    if (!/\b(?:\d+)?d100/i.test(raw) || !/@\{[^}]+\}/.test(raw)) return false;
    return sourceTemplateFieldNames(raw).some(function (name) {
      return /(?:^|[_-])(?:stat|threshold|target|success|skill|ability|characteristic|score)(?:$|[_-])/i.test(name);
    });
  }

  function rollStatusCategory(item) {
    var structure = (item.groupLabels || []).concat(item.structureLabels || []);
    if (rollStatusMatches(structure, /(?:광기|정신\s*이상|발작|insanit|madness|bout)/i)) return 'madness';
    if (rollStatusMatches(structure, /(?:주문|마법|주술|시전|spell|magic|sorcer|ritual)/i)) return 'spell';
    if (rollStatusMatches(structure, /(?:무기|전투|공격|피해|방어구|장갑|탄약|weapon|combat|attack|damage|defen[cs]e|armo(?:u)?r|ammo)/i)) return 'combat';
    if (/&\{tracker\}/i.test(String(item && item.roll && item.roll.raw || ''))) return 'other';
    var context = (item.contextLabels || []).concat([item.label]);
    if (!contractRepeating(item.roll) && (matchesDetectedRole(context, 'characteristic') ||
        rollStatusMatches(item.structureLabels, /(?:^|[_-])characteristic(?:$|[_-])/i))) return 'characteristic';
    if (rollHasOutcomeStructure(item) || rollHasPercentileThreshold(item)) return 'check';
    if (rollStatusMatches(context, /(?:광기|정신\s*이상|발작|insanit|madness|bout)/i)) return 'madness';
    if (rollStatusMatches(context, /(?:주문|마법|주술|spell|magic|ritual)/i)) return 'spell';
    if (rollStatusMatches(context, /(?:무기|weapon)/i)) return 'combat';
    return 'other';
  }

  function groupedRollItems(items) {
    var groups = dictionary();
    ROLL_STATUS_GROUPS.forEach(function (group) { groups[group.key] = []; });
    (items || []).forEach(function (item) { groups[rollStatusCategory(item)].push(item); });
    return ROLL_STATUS_GROUPS.map(function (group) {
      return { key: group.key, title: group.title, items: groups[group.key] };
    });
  }

  function statusResourceItems(data) {
    return (data && data.resources || []).filter(function (item) { return item.statusResource === true; });
  }

  function rollGroupSections(items, renderItem) {
    return groupedRollItems(items).filter(function (group) { return group.items.length; }).map(function (group) {
      return section(group.title + ' ' + group.items.length + '개', group.items.map(renderItem).join(' '));
    }).join('');
  }

  function contractRollDisplayValue(data, instance) {
    var characterId = data.characterId;
    var tr = /\{\{\s*(?:[^={}]*?(?:threshold|target)[^={}]*|stat|s(?:core|uccess|kill)|ability|characteristic)\s*=\s*\[\[([\s\S]*?)\]\]\s*\}\}/i;
    var tm = String(instance.roll.raw).match(tr);
    var m = tm ? qualifyContractMacro(characterId, Object.assign({}, instance, {
      roll: Object.assign({}, instance.roll, { raw: tm[0] }),
    }), null) : null;
    if (m && m.ok) {
      var v = m.content.match(tr);
      var n = v && resolvedResourceValue(characterId, v[1].replace(/\[\[/g, '(').replace(/\]\]/g, ')'));
      if (n && n.number !== null) return n.text;
    }
    var values = [];
    var seenRefs = dictionary();
    var seenValues = dictionary();
    var ignored = dictionary();
    var runtimeIndex = contractRuntimeIndex(instance.contract);
    var repeating = contractRepeating(instance.roll);
    var sourceFields = repeating && runtimeIndex.fieldSections[repeating.section] || runtimeIndex.fieldGlobal;
    var sourceControls = runtimeIndex.rollControls[instance.roll.key] || runtimeIndex.controls;
    var savedAttributes = data.attributeByName || dictionary();
    contractControls(instance.contract, instance.roll).forEach(function (control) {
      var name = contractControlName(control);
      if (name) ignored[name] = true;
    });
    String(instance && instance.roll && instance.roll.raw || '').replace(
      /@\{([A-Za-z0-9_$-]+)(?:\|(max))?\}/g,
      function (match, name, valueType) {
        if (ignored[name]) return match;
        var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
        var refKey = fullName + '|' + (valueType || 'current');
        if (seenRefs[refKey]) return match;
        seenRefs[refKey] = true;
        var resource = data.resourcesByAttribute && data.resourcesByAttribute[fullName];
        var property = valueType === 'max' ? 'max' : 'value';
        var field = sourceFields[name] || runtimeIndex.fieldGlobal[name];
        if (field && /^(?:checkbox|radio)$/i.test(trim(field.type))) return match;
        var fallback = field && field[valueType === 'max' ? 'max' : 'default'];
        if ((fallback === undefined || fallback === null || trim(fallback) === '') && valueType !== 'max') {
          var control = sourceControls[name] || runtimeIndex.controls[name];
          fallback = control && control.default;
        }
        var stored = savedAttributes[fullName];
        var live = stored ? null : getAttr(characterId, fullName, valueType || 'current');
        var raw = resource && own(resource, property) && resource[property] !== null
          ? resource[property]
          : stored ? stored.get(valueType === 'max' ? 'max' : 'current')
            : field && field.numericCandidate && !field.hidden && !field.readonly && !field.disabled &&
              fallback !== undefined && fallback !== null && trim(fallback) !== ''
              ? contractUnsavedFieldValue(field, live, fallback, valueType === 'max') : live;
        if (raw === undefined) return match;
        var resolved = resolvedResourceValue(characterId, raw);
        if (resolved.number === null || seenValues[resolved.text]) return match;
        seenValues[resolved.text] = true;
        values.push(resolved.text);
        return match;
      },
    );
    return values.length === 1 ? values[0] : '';
  }

  function contractRollDamageText(characterId, instance) {
    var qualified = qualifyContractMacro(characterId, instance, null);
    if (!qualified.ok) return '';
    var fields = messageTemplateFields({ content: qualified.content });
    var name = Object.keys(fields).filter(function (key) {
      return /^(?:피해|damage|dmg)$/i.test(trim(key));
    })[0];
    var value = trim(name && fields[name]);
    var inline = value.match(/^\[\[([\s\S]*)\]\]$/);
    return trim(inline ? inline[1] : value);
  }

  function contractSelectionCommand(characterId, instance, count, secret) {
    return count > 1
      ? '!시트 굴림목록|' + encodeURIComponent(characterId) + '|' + encodeURIComponent(instance.label) + '|' + (secret ? '1' : '0')
      : '!시트 굴림선택|' + encodeURIComponent(characterId) + '|' + encodeURIComponent(instance.contract.id) + '|' +
        encodeURIComponent(instance.roll.key) + '|' + encodeURIComponent(instance.row ? instance.row.id : '') + '||' +
        (secret ? '1' : '0') + '|';
  }

  function recognizedRollItems(data) {
    var result = [];
    if (usableContractInspection(data.contractMatch)) {
      var rolls = preferredContractRolls(data);
      var counts = dictionary();
      rolls.forEach(function (instance) {
        var key = normalize(instance.label);
        if (key) counts[key] = (counts[key] || 0) + 1;
      });
      var seen = dictionary();
      rolls.forEach(function (instance) {
        var key = normalize(instance.label);
        if (!key || seen[key]) return;
        seen[key] = true;
        result.push({
          kind: 'contract',
          label: instance.label,
          aliases: instance.aliases || [],
          value: contractRollDisplayValue(data, instance),
          modes: sortedUnique((instance.modes || []).reduce(function (labels, mode) {
            return labels.concat(contractUserModeLabels(mode));
          }, [])),
          command: contractSelectionCommand(data.characterId, instance, counts[key], false),
        });
      });
    }
    return result.sort(function (left, right) { return left.label.localeCompare(right.label); });
  }

  function statusModeEntries(characterId, instance) {
    var groups = dictionary();
    var candidates = contractModeCandidates(instance, true);
    var current = currentContractModes(characterId, instance);
    var context = rollStatusContext(instance);
    var category = rollStatusCategory({
      label: rollStatusLabel(instance), groupLabels: context.groups, contextLabels: context.labels,
      structureLabels: context.structure, sourceRaw: context.sourceRaw, contract: instance.contract, roll: instance.roll,
    });
    if (current.length && category === 'combat') candidates = candidates.filter(function (candidate) {
      return current.indexOf(candidate.mode) > -1 || contractUserModeLabels(candidate.mode).some(function (label) {
        return /(?:보너스|패널티|페널티|bonus|penalty)/i.test(normalize(label));
      });
    });
    candidates.forEach(function (candidate) {
      var labels = contractUserModeLabels(candidate.mode).map(contractDisplayLabel).filter(Boolean);
      var parts = labels.join(' | ').split(/\s*(?:\|\||::|[|｜/>])\s*/).map(normalize).filter(Boolean);
      var key = parts.length ? parts[parts.length - 1] : trim(candidate.mode && candidate.mode.id);
      if (!groups[key]) groups[key] = [];
      groups[key].push(candidate);
    });
    var selected = [];
    Object.keys(groups).forEach(function (key) {
      selected = selected.concat(preferCurrentModeContext(characterId, groups[key]));
    });
    var result = [];
    uniqueContractCandidates(selected).forEach(function (candidate) {
      var labels = contractUserModeLabels(candidate.mode).map(contractDisplayLabel).filter(Boolean);
      labels.filter(function (label) {
        var key = normalize(label);
        if (labels.some(function (other) {
          return /(?:보너스|패널티|페널티|bonus|penalty)/i.test(normalize(other));
        }) && /^\d+\s*개(?:\s|$)/.test(label) &&
            !contractDisplayLabel(label.replace(/^\d+\s*개\s*/, ''))) return false;
        return !/(?:보너스|패널티|페널티|bonus|penalty)/i.test(key) || !labels.some(function (other) {
          var otherKey = normalize(other);
          return otherKey.indexOf(key) === 0 && /^\+?\d+(?:개)?$/.test(otherKey.slice(key.length));
        });
      }).forEach(function (label) {
        result.push({
          id: trim(candidate.mode.id), label: label,
          modifier: /(?:보너스|패널티|페널티|bonus|penalty)/i.test(normalize(label)),
        });
      });
    });
    return result;
  }

  function statusRollIdentity(instance) {
    var roll = instance && instance.roll || {};
    var repeating = contractRepeating(roll);
    var source = trim(roll.name) ? 'name:' + trim(roll.name) : 'raw:' + String(roll.raw || '');
    return JSON.stringify([
      instance && instance.contract && instance.contract.id || '',
      roll.kind || 'contract',
      repeating && repeating.section || '',
      instance && instance.row && instance.row.id || '',
      source,
      instance && instance.modes || [],
    ]);
  }

  function statusRollLabelIdentity(instance) {
    if (!rollStatusLabel(instance)) return '';
    var roll = instance && instance.roll || {};
    var repeating = contractRepeating(roll);
    return JSON.stringify([
      normalize(rollStatusLabel(instance)),
      repeating && repeating.section || '',
      instance && instance.row && instance.row.id || '',
    ]);
  }

  function statusRollItems(data, includeEveryInstance) {
    var result = [];
    var counts = dictionary();
    var seen = dictionary();
    var seenLabels = dictionary();
    if (!usableContractInspection(data.contractMatch)) return result;
    // 같은 행이 원본 정렬에 여러 번 있으면 유지하고, 그 행의 보조 버튼만 제외합니다.
    var instances = includeEveryInstance ? data.contractRolls : preferredContractRolls(data);
    instances.forEach(function (instance) {
      var key = normalize(instance.label);
      if (key) counts[key] = (counts[key] || 0) + 1;
    });
    instances.forEach(function (instance) {
      var label = rollStatusLabel(instance);
      var key = statusRollIdentity(instance);
      if (!key) return;
      var modeEntries = statusModeEntries(data.characterId, instance);
      if (!includeEveryInstance && seen[key] &&
          (!instance.row || seen[key].roll.key !== instance.roll.key)) {
        seen[key].modeEntries = seen[key].modeEntries.concat(modeEntries);
        return;
      }
      var context = rollStatusContext(instance);
      var item = {
        label: label,
        value: contractRollDisplayValue(data, instance),
        command: contractSelectionCommand(data.characterId, instance, counts[normalize(instance.label)] || 1, false),
        modeEntries: modeEntries,
        groupLabels: context.groups,
        contextLabels: context.labels,
        structureLabels: context.structure,
        sourceRaw: context.sourceRaw,
        contract: instance.contract,
        roll: instance.roll,
      };
      if (!label && (!modeEntries.length || rollStatusCategory(item) !== 'madness')) return;
      if (rollStatusCategory(item) === 'combat')
        item.damage = contractRollDamageText(data.characterId, instance);
      if (!seen[key]) seen[key] = item;
      var labelKey = statusRollLabelIdentity(instance);
      if (labelKey && !seenLabels[labelKey]) seenLabels[labelKey] = item;
      result.push(item);
    });
    (data.contractAllRolls || []).forEach(function (instance) {
      if (!instance.hidden) return;
      var item = seen[statusRollIdentity(instance)] || seenLabels[statusRollLabelIdentity(instance)];
      if (item) item.modeEntries = item.modeEntries.concat(statusModeEntries(data.characterId, instance));
    });
    return result.sort(function (left, right) { return left.label.localeCompare(right.label); });
  }

  function statusModeLayout(rolls) {
    var uses = dictionary();
    (rolls || []).forEach(function (item) {
      (item.modeEntries || []).forEach(function (entry) {
        if (!entry.id) return;
        uses[entry.id] = uses[entry.id] || dictionary();
        uses[entry.id][item.roll.key] = true;
      });
    });
    var shared = dictionary();
    Object.keys(uses).forEach(function (id) {
      if (Object.keys(uses[id]).length > 1) shared[id] = true;
    });
    var diceTypes = [];
    var madnessModes = dictionary();
    var items = [];
    (rolls || []).forEach(function (item) {
      var localModes = item.damage ? ['피해 ' + item.damage] : [];
      (item.modeEntries || []).forEach(function (entry) {
        if (entry.modifier) diceTypes.push(entry.label);
        else if (!shared[entry.id]) localModes.push(entry.label);
      });
      localModes = sortedUnique(localModes);
      if (rollStatusCategory(item) === 'madness' && localModes.length) {
        localModes.forEach(function (label) {
          var key = normalize(label);
          if (madnessModes[key]) return;
          madnessModes[key] = true;
          items.push(merge(merge({}, item), {
            label: label, value: '', localModes: [], contextLabels: (item.contextLabels || []).concat(item.label),
          }));
        });
        return;
      }
      item.localModes = localModes;
      items.push(item);
    });
    return { items: items, diceTypes: sortedUnique(diceTypes) };
  }

  function itemDetailText(data, detail) {
    var value = detail && detail[1];
    if (value === undefined || value === '') return '';
    return escapeHtml(detail[0]) + ' ' + escapeHtml(resolvedResourceValue(data.characterId, value).text || '-');
  }

  function searchHtml(data, query) {
    var wanted = normalize(query);
    var items = recognizedRollItems(data).concat(statusResourceItems(data).map(function (item) {
      return {
        kind: 'resource', label: item.label, aliases: item.aliases,
        value: fieldValueText(data.characterId, item, resourceRawValue(data.characterId, item)), command: '',
      };
    }));
    items = items.filter(function (item) {
      return [item.label].concat(item.aliases || []).some(function (value) {
        var key = normalize(value);
        return key && (key.indexOf(wanted) > -1 || wanted.indexOf(key) > -1);
      });
    }).sort(function (left, right) { return left.label.localeCompare(right.label); });
    if (!items.length)
      return '<b>' + escapeHtml(query) + '</b>과 이름이 비슷한 항목을 찾지 못했습니다.';
    var labels = { contract: '굴림', resource: '수치' };
    return '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:8px 10px;background:#111;color:#fff"><b>' +
      escapeHtml(data.characterName) + ' / ' + escapeHtml(query) + ' 검색</b></div><table style="width:100%;border-collapse:collapse">' +
      items.map(function (item) {
        var details = (item.details || []).map(function (detail) { return itemDetailText(data, detail); }).filter(Boolean);
        return '<tr><td style="padding:7px;border-bottom:1px solid #ddd"><b>' + escapeHtml(item.label) + '</b> ' +
          '<span style="color:#777;font-size:11px">' + escapeHtml(labels[item.kind] || '항목') + '</span>' +
          (item.value !== '' && item.value !== undefined ? '<br><span style="color:#333">현재 ' + escapeHtml(item.value) + '</span>' : '') +
          (details.length ? '<br><span style="color:#555;font-size:11px">' + details.join(' / ') + '</span>' : '') + '</td>' +
          '<td style="padding:7px;text-align:right;white-space:nowrap">' +
          (item.command ? button('굴리기', item.command, '#111') : '') + '</td></tr>';
      }).join('') + '</table></div>';
  }

  function button(label, command, color) {
    return '<a href="' + escapeHtml(command) + '" style="display:inline-block;margin:2px 1px;padding:5px 8px;background:' +
      (color || '#53657d') + ';color:#fff;text-decoration:none;font-weight:bold;font-size:12px">' + escapeHtml(label) + '</a>';
  }

  function section(title, body) {
    return '<div style="margin-top:10px;border:1px solid #111;background:#fff;color:#111"><div style="padding:6px 9px;background:#111;color:#fff;font-weight:bold">' +
      escapeHtml(title) + '</div><div style="padding:8px">' + body + '</div></div>';
  }

  function recognizedTable(items, actions) {
    return '<table style="width:100%;border-collapse:collapse"><tr>' +
      '<th style="padding:6px;border-bottom:1px solid #bbb;text-align:left">항목</th>' +
      '<th style="padding:6px;border-bottom:1px solid #bbb;text-align:left">현재값 / 방식</th>' +
      (actions ? '<th style="padding:6px;border-bottom:1px solid #bbb;text-align:right">실행</th>' : '') + '</tr>' +
      (items || []).map(function (item) {
        var detail = [];
        if (item.value !== '' && item.value !== undefined) detail.push('<b>' + escapeHtml(item.value) + '</b>');
        if (item.localModes && item.localModes.length) detail.push(item.localModes.map(escapeHtml).join(' / '));
        return '<tr><td style="padding:6px;border-bottom:1px solid #ddd"><b>' + escapeHtml(item.label) + '</b></td>' +
          '<td style="padding:6px;border-bottom:1px solid #ddd">' + detail.join('<br>') + '</td>' +
          (actions ? '<td style="padding:4px 6px;border-bottom:1px solid #ddd;text-align:right;white-space:nowrap">' +
            (item.command ? button('실행', item.command, '#111') : '') + '</td>' : '') + '</tr>';
      }).join('') + '</table>';
  }

  function recognizedTablesHtml(data, actions, includeEveryInstance) {
    var layout = statusModeLayout(statusRollItems(data, includeEveryInstance));
    var groups = dictionary();
    groupedRollItems(layout.items).forEach(function (group) { groups[group.key] = group; });
    var html = '';
    ['characteristic', 'check', 'combat', 'spell', 'madness'].forEach(function (key) {
      var group = groups[key];
      if (group && group.items.length) html += section(group.title + ' ' + group.items.length + '개', recognizedTable(group.items, actions));
    });
    var statusResources = statusResourceItems(data);
    if (statusResources.length) {
      var resources = statusResources.map(function (item) {
        return {
          label: item.label,
          value: fieldValueText(data.characterId, item, resourceRawValue(data.characterId, item)),
        };
      });
      html += section('수치 ' + resources.length + '개', recognizedTable(resources, false));
    }
    if (groups.other && groups.other.items.length)
      html += section(groups.other.title + ' ' + groups.other.items.length + '개', recognizedTable(groups.other.items, actions));
    if (layout.diceTypes.length)
      html += section('다이스 종류 ' + layout.diceTypes.length + '개', recognizedTable(layout.diceTypes.map(function (label) {
        return { label: label, value: '' };
      }), false));
    return html;
  }

 function cutinItems() {
    var found = dictionary();
    var sourceLabels = dictionary();
    function add(item, kind, system, key, characterName) {
      if (!item || !trim(item.label)) return;
      system = system || 'sheet';
      key = key || resultKey(system, item.label);
      if (!found[key]) found[key] = {
        key: key, label: item.label, kind: kind, system: system,
        aliases: item.aliases || [], characterName: characterName || '',
        command: item.command || '', type: item.type || '',
      };
    }
    var character = profileCharacters()[0];
    if (character) {
      (scan(character.id).contractRolls || []).forEach(function (instance) {
        var key = contractCutinKey(instance);
        if (!found[key]) {
          var seenLabels = dictionary();
          sourceLabels[key] = [instance.roll.label].concat(instance.roll.aliases || [])
            .map(contractDisplayLabel).filter(function (label) {
              var labelKey = normalize(label);
              if (!labelKey || seenLabels[labelKey] || labelKey === normalize(instance.label) ||
                  labelKey === normalize(instance.roll.name) || labelKey === normalize(instance.roll.key)) return false;
              seenLabels[labelKey] = true;
              return true;
            });
        }
        add(
          { label: instance.label, aliases: instance.aliases, command: '', type: 'contract' },
          instance.roll.kind || 'contract',
          'sheet',
          key,
          character.get('name'),
        );
      });
    }
    var items = Object.keys(found).map(function (key) { return found[key]; }).sort(function (a, b) {
      return a.label.localeCompare(b.label);
    });
    var counts = dictionary();
    var indexes = dictionary();
    var sourceLabelCounts = dictionary();
    items.forEach(function (item) {
      var labelKey = normalize(item.label);
      counts[labelKey] = (counts[labelKey] || 0) + 1;
      var labels = sourceLabelCounts[labelKey] || (sourceLabelCounts[labelKey] = dictionary());
      (sourceLabels[item.key] || []).forEach(function (label) {
        var key = normalize(label);
        labels[key] = (labels[key] || 0) + 1;
      });
    });
    items.forEach(function (item) {
      var labelKey = normalize(item.label);
      if (counts[labelKey] < 2) return;
      indexes[labelKey] = (indexes[labelKey] || 0) + 1;
      var sourceLabel = (sourceLabels[item.key] || []).filter(function (label) {
        return sourceLabelCounts[labelKey][normalize(label)] < counts[labelKey];
      })[0];
      item.displayLabel = item.label + ' (' + (sourceLabel ? sourceLabel + ' / ' : '') +
        (item.characterName || '항목') + ' ' + indexes[labelKey] + ')';
    });
    return items;
  }

  function managerHtml() {
    var data = initState();
    var characters = profileCharacters();
    if (!characters.some(function (character) { return character.id === data.managerCharacterId; }))
      data.managerCharacterId = characters.length ? characters[0].id : '';
    var characterButtons = characters.length
      ? characters.map(function (character) {
          return button(
            character.id === data.managerCharacterId ? '✓ ' + character.get('name') : character.get('name'),
            '!시트 현황보기|' + character.id,
            character.id === data.managerCharacterId ? '#111' : '#53657d',
          );
        }).join(' ')
      : '<span style="color:#777">' + SHEET_NOT_RECOGNIZED + '</span>';
    var trackingLabel = data.trackingMode === 'public' ? '전체 공개' : data.trackingMode === 'gm' ? 'GM만' : '끄기';
    var trackingControls = '<b>수치 변화 알림:</b> ' + trackingLabel + '<br>' +
      button('전체 공개', '!시트 변화알림|공개', data.trackingMode === 'public' ? '#111' : '#53657d') + ' ' +
      button('GM만', '!시트 변화알림|GM', data.trackingMode === 'gm' ? '#111' : '#53657d') + ' ' +
      button('끄기', '!시트 변화알림|끄기', data.trackingMode === 'off' ? '#111' : '#53657d') +
      '<br><b>플레이어 권한이 없는 GM 캐릭터도 알림:</b> ' + (data.trackGmOnly ? '켜기' : '끄기') + '<br>' +
      button('켜기', '!시트 GM캐릭터알림|켜기', data.trackGmOnly ? '#111' : '#53657d') + ' ' +
      button('끄기', '!시트 GM캐릭터알림|끄기', data.trackGmOnly ? '#53657d' : '#111');
    var body =
      '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:12px;background:#111;color:#fff"><b style="font-size:18px">🎲 시트 헬퍼 관리</b></div>' +
      section('설정', button('시트 다시 읽기', '!시트 새로고침', '#287a4b') + '<br><br>' + trackingControls) +
      section('캐릭터별 현황 보기', '<span style="color:#555;font-size:11px">API가 인식한 현재 캐릭터들 현황 모아보기</span><br>' + characterButtons);
    var viewed = data.managerCharacterId && scan(data.managerCharacterId);
    if (viewed && viewed.ok) {
      var hasContract = usableContractInspection(viewed.contractMatch);
      var issues = (viewed.warnings || []).slice();
      if (hasContract) {
        var modesIncomplete = viewed.contractRolls.some(function (instance) {
          return instance.roll && instance.roll.modesIncomplete === true;
        });
        if (modesIncomplete)
          issues.push('일부 선택 방식은 안전하게 실행할 수 없어 생략했습니다. 해당 굴림은 시트에서 직접 실행해 주세요.');
        body += recognizedTablesHtml(viewed, false);
      } else body += section('인식 결과', SHEET_NOT_RECOGNIZED);
      if (issues.length) body += section('확인할 항목', issues.map(escapeHtml).join('<br>'));
    }
    return body + '</div>';
  }

  function managerHandout() {
    var data = initState();
    var handout = getObj('handout', data.managerId) || (findObjs({ _type: 'handout', name: sheet_helper_setting.manager_name }) || [])[0];
    if (!handout)
      handout = createObj('handout', { name: sheet_helper_setting.manager_name, inplayerjournals: '', controlledby: '', archived: false });
    if (!handout) return null;
    data.managerId = handout.id;
    var html = managerHtml();
    var hash = String(html.length) + ':' + simpleHash(html);
    if (data.managerHash !== hash) {
      handout.set({ name: sheet_helper_setting.manager_name, inplayerjournals: '', controlledby: '', archived: false, notes: html });
      data.managerHash = hash;
    }
    return handout;
  }

  function playerHelpHandout() {
    var data = initState();
    var handout = getObj('handout', data.playerHelpId) ||
      (findObjs({ _type: 'handout', name: sheet_helper_setting.player_help_name }) || [])[0];
    if (!handout)
      handout = createObj('handout', {
        name: sheet_helper_setting.player_help_name,
        inplayerjournals: 'all',
        controlledby: '',
        archived: false,
      });
    if (!handout) return null;
    data.playerHelpId = handout.id;
    var html = playerHelpHtml();
    var hash = String(html.length) + ':' + simpleHash(html);
    if (data.playerHelpHash !== hash) {
      handout.set({
        name: sheet_helper_setting.player_help_name,
        inplayerjournals: 'all',
        controlledby: '',
        archived: false,
        notes: html,
      });
      data.playerHelpHash = hash;
    }
    return handout;
  }

  function simpleHash(value) {
    var hash = 2166136261;
    for (var i = 0; i < value.length; i++) {
      hash ^= value.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return (hash >>> 0).toString(16);
  }

  function scheduleManager() {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () {
      refreshTimer = null;
      try {
        managerHandout();
        playerHelpHandout();
        var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
        if (cutin && typeof cutin.refreshSheetControls === 'function')
          cutin.refreshSheetControls();
      } catch (err) {
        whisperGm('시트 헬퍼 관리 갱신 오류: ' + escapeHtml(err.message || err));
      }
    }, sheet_helper_setting.refresh_delay);
  }

  function openManager() {
    var handout = managerHandout();
    return handout
      ? '<a href="http://journal.roll20.net/handout/' + encodeURIComponent(handout.id) + '" style="display:inline-block;padding:5px 8px;background:#111;color:#fff;text-decoration:none;font-weight:bold">시트 헬퍼 관리 열기</a>'
      : '관리 핸드아웃을 만들지 못했습니다.';
  }

  function playerName(msg) {
    var player = getObj('player', msg.playerid);
    return player ? trim(player.get('_displayname')) : trim(msg.who).replace(/\s*\(GM\)\s*$/, '') || 'gm';
  }

  function whisper(msg, text) {
    sendChat('시트 헬퍼', '/w "' + playerName(msg).replace(/"/g, '') + '" ' + safeWhisperText(text), null, { noarchive: true });
  }

  function whisperGm(text) {
    sendChat('시트 헬퍼', '/w gm ' + safeWhisperText(text), null, { noarchive: true });
  }

  function safeWhisperText(text) {
    return String(text == null ? '' : text).replace(/@\{/g, '&#64;{');
  }

  function switchSpeaker(msg, query) {
    if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
    var player = getObj('player', msg.playerid);
    if (!player) return whisper(msg, '화자를 바꿀 플레이어 정보를 찾지 못했습니다.');
    var rawDisplayName = trim(player.get('_displayname'));
    var displayName = rawDisplayName.replace(/\s*\(GM\)\s*$/i, '');
    if (
      normalize(query) === normalize(rawDisplayName) ||
      normalize(query) === normalize(displayName) ||
      /^(?:나|본인|해제|끄기|off)$/i.test(trim(query))
    ) {
      if (player.get('speakingas')) player.set({ speakingas: '' });
      return whisper(msg, '화자: <b>' + escapeHtml(player.get('_displayname')) + '</b>');
    }
    var found = resolveCharacterName(query, characterObjects());
    if (!found.ok) return whisper(msg, escapeHtml(found.error));
    var speakingAs = 'character|' + found.character.id;
    if (player.get('speakingas') !== speakingAs) player.set({ speakingas: speakingAs });
    return whisper(msg, '화자: <b>' + escapeHtml(found.character.get('name')) + '</b>');
  }

  function helpHtml() {
    return playerHelpHtml() +
      '<div style="margin-top:10px;padding-top:8px;border-top:1px solid #aaa"><b>GM 명령어</b><br>' +
      '<code>!!관리</code> 캐릭터별 인식 항목과 현재 수치 현황<br>' +
      '<code>!!점검</code> 현황에서 확인 중인 캐릭터의 인식 상태 점검<br>' +
      '<code>!!화자 이름</code> 채팅 화자 전환<br>' +
      '<code>!!화자 본인</code> 캐릭터 화자를 해제하고 GM 오너 프로필로 복귀<br>' +
      '<code>!!변화알림 공개|GM|끄기</code> 수치 변화 알림 공개 범위<br>' +
      '<code>!!GM캐릭터알림 켜기|끄기</code> 플레이어 권한이 없는 GM 캐릭터도 알림에 포함</div>';
  }

  function playerHelpHtml() {
    var character = profileCharacters()[0];
    var contractFree = !!character && scannedContractRolls(character.id, true).some(function (instance) {
      return !!contractExpressionRef(character.id, instance);
    });
    var rows = [
      ['!!굴릴항목이름', '해당 항목을 굴립니다. 예: <code>!!관찰력</code>'],
      ['!!비밀 굴릴항목이름', '결과를 GM에게만 보냅니다. 예: <code>!!비밀 관찰력</code>'],
      ['!!굴릴항목이름 보너스/패널티개수', '보너스 또는 패널티 주사위 개수를 붙여 굴립니다. 예: <code>!!관찰력 보너스1</code>, <code>!!관찰력 패널티2</code>'],
      ['!!검색 이름', '이름이 비슷한 항목과 현재 수치를 찾아 바로 굴립니다.'],
      ['!!상태', '내 캐릭터에서 인식된 굴림과 수치를 가나다순으로 봅니다.'],
      [':수치이름+3', '내 캐릭터 수치를 바꿉니다. 예: <code>:체력-1d3</code>, <code>:마력=10</code>'],
    ];
    if (contractFree)
      rows.push(['!!r 2d6+3', '현재 시트의 자유 주사위 디자인으로 식을 굴립니다.']);
    return (
      '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:10px;background:#111;color:#fff"><b>시트 헬퍼 사용법</b></div>' +
      '<table style="width:100%;border-collapse:collapse">' + rows.map(function (row) {
        return '<tr><td style="width:42%;padding:7px 8px;border-bottom:1px solid #ddd;background:#f5f5f5;vertical-align:top"><code style="font-weight:bold">' +
          escapeHtml(row[0]) + '</code></td><td style="padding:7px 8px;border-bottom:1px solid #ddd;vertical-align:top">' + row[1] + '</td></tr>';
      }).join('') + '</table><div style="padding:8px 10px">' +
      button('내 상태 보기', '!!상태', '#111') + ' ' +
      button('항목 검색', '!!검색 ?{찾을 이름}', '#111') +
      '<br><span style="color:#555;font-size:11px">이름 일부가 여러 항목과 맞으면 검정 선택 버튼으로 고를 수 있습니다.</span></div></div>'
    );
  }

  function statusHtml(data) {
    var rolls = statusRollItems(data);
    var modeLayout = statusModeLayout(rolls);
    var body = '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:8px 10px;background:#111;color:#fff"><b>' +
      escapeHtml(data.characterName) + ' / 시트 현황</b></div>';
    body += modeLayout.items.length ? rollGroupSections(modeLayout.items, function (item) {
      return '<span style="display:inline-block;margin:0 8px 3px 0">' + escapeHtml(item.label) +
        (item.value ? ' <b>' + escapeHtml(item.value) + '</b>' : '') +
        (item.localModes && item.localModes.length ? ' <span style="color:#555">(' + item.localModes.map(escapeHtml).join(' / ') + ')</span>' : '') + '</span>';
    }) : section('굴릴 항목', '<span style="color:#777">없음</span>');
    if (modeLayout.diceTypes.length)
      body += section('다이스 종류 ' + modeLayout.diceTypes.length + '개', modeLayout.diceTypes.map(escapeHtml).join(', '));
    var statusResources = statusResourceItems(data);
    if (statusResources.length)
      body += section('현재 수치 ' + statusResources.length + '개', statusResources.map(function (item) {
        return escapeHtml(item.label) + ' <b>' + escapeHtml(fieldValueText(data.characterId, item, resourceRawValue(data.characterId, item))) + '</b>';
      }).join(', '));
    return body + '<div style="padding:8px 10px;color:#555;font-size:11px">항목을 좁혀 보려면 <code>!!검색 이름</code>을 입력하세요.</div></div>';
  }

  function inspectionHtml(data) {
    var recognition = data.contractMatch || {};
    var incomplete = usableContractInspection(data.contractMatch)
      ? (data.contractRolls || []).filter(function (instance) { return instance.roll && instance.roll.modesIncomplete === true; }).length
      : 0;
    var issues = (data.warnings || []).slice();
    if (incomplete) issues.push('선택 방식을 전부 안전하게 읽지 못한 굴림 ' + incomplete + '개');
    if (recognition.contractCount && !usableContractInspection(recognition))
      issues.push('설치된 시트 인식 정보가 방의 저장 항목과 일치하지 않습니다.');
    var matched = usableContractInspection(recognition);
    return '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:8px 10px;background:#111;color:#fff"><b>' +
      escapeHtml(data.characterName) + ' / GM 인식 점검</b></div>' +
      section('인식 결과', matched
        ? '<b>인식 완료</b> / 현재 캐릭터의 굴림 ' + data.contractRolls.length + '개 / 수치 ' + statusResourceItems(data).length + '개'
        : SHEET_NOT_RECOGNIZED) +
      (matched ? recognizedTablesHtml(data, false, true) : '') +
      section('확인할 항목', issues.length ? issues.map(escapeHtml).join('<br>') : '<span style="color:#287a4b">확인할 문제가 없습니다.</span>') +
      '</div>';
  }

  function reportResult(msg, result) {
    if (result && result.ok === false)
      whisper(msg, result.reason === 'conflict' && result.choices ? bangBangChoiceHtml(result.choices) : escapeHtml(result.error));
    else if (result && result.queryOnly)
      whisper(msg, '<b>' + escapeHtml(result.weapon.label) + '</b> 탄약: ' + escapeHtml(result.value === '' ? '-' : result.value));
    return result;
  }

  function withCharacter(msg, explicitId, callback) {
    var resolved = resolveCharacter(msg, explicitId);
    if (!resolved.ok) return reportResult(msg, resolved);
    return reportResult(msg, callback(resolved.character));
  }

  function uniqueResources(items) {
    var seen = dictionary();
    return (items || []).filter(function (item) {
      if (!item || seen[item.name]) return false;
      seen[item.name] = true;
      return true;
    });
  }

  function resolveResource(data, query) {
    var wanted = normalize(query);
    if (!wanted) return { ok: false, error: '바꿀 수치 이름을 적어 주세요.' };
    var exact = uniqueResources(data.resourceAliases[wanted] || []);
    if (exact.length === 1) return { ok: true, item: exact[0] };
    var primary = exact.filter(function (item) {
      return normalize(item.label) === wanted || normalize(item.name) === wanted;
    });
    if (primary.length === 1) return { ok: true, item: primary[0] };
    if (exact.length > 1)
      return { ok: false, error: '같은 이름의 수치가 여러 개입니다: ' + exact.map(function (item) { return item.label; }).join(', ') };
    var roles = ['health', 'magicPoints', 'sanity', 'startingSanity'].filter(function (role) {
      return (DETECTED_ROLE_LABELS[role] || []).indexOf(wanted) > -1;
    });
    if (roles.length === 1) {
      var detected = detectedFieldRole(data, roles[0], 'resource');
      if (detected.item) return { ok: true, item: detected.item };
    }
    var partial = uniqueResources((data.resources || []).filter(function (item) {
      return item.aliases.some(function (alias) { return normalize(alias).indexOf(wanted) > -1; });
    }));
    if (partial.length === 1) return { ok: true, item: partial[0] };
    if (partial.length > 1)
      return { ok: false, error: '이름이 비슷한 수치가 여러 개입니다: ' + partial.map(function (item) { return item.label; }).join(', ') };
    return { ok: false, error: '현재 시트에서 ' + trim(query) + ' 수치를 찾지 못했습니다.' };
  }

  function rollAmount(expression) {
    var source = trim(expression || '');
    var dice = source.match(/^(\d*)d(\d+)$/i);
    if (!dice) {
      var fixed = Number(source);
      return isFinite(fixed) ? { ok: true, value: fixed, detail: source } : { ok: false };
    }
    var count = Number(dice[1] || 1);
    var sides = Number(dice[2]);
    if (count < 1 || count > 100 || sides < 1 || sides > 100000) return { ok: false };
    var rolls = [];
    var total = 0;
    for (var i = 0; i < count; i += 1) {
      var rolled = randomInteger(sides);
      rolls.push(rolled);
      total += rolled;
    }
    return { ok: true, value: total, detail: source + ' [' + rolls.join(', ') + ']' };
  }

  function toggleValue(value) {
    var normalized = trim(value).toLowerCase();
    if (/^(?:1|on|true)$/.test(normalized)) return true;
    if (/^(?:0|off|false|)$/.test(normalized)) return false;
    return null;
  }

  function sanityValueText(characterId, item, current, hideMaximum) {
    var data = scan(characterId);
    var sanity = detectedFieldRole(data, 'sanity', 'number');
    if (!sanity.item || sanity.item.name !== item.name) return '';
    var starting = detectedFieldRole(data, 'startingSanity', 'number');
    var startingValue = starting.item && numericFieldValue(characterId, resourceRawValue(characterId, starting.item));
    var hasStarting = starting.item && starting.item.name !== item.name && startingValue > 0;
    var hasStartingField = starting.matches.length || sourceCandidateInspections(data.contractMatch).some(function (candidate) {
      return (candidate.contract.fields || []).some(function (field) {
        var labels = [field.label].concat(field.aliases || []);
        return matchesDetectedRole(labels, 'startingSanity') ||
          linkedStartingSanityField(field, sanity.item.name, labels);
      });
    });
    var text = String(current);
    if (hasStarting)
      text += ' / 시작 ' + startingValue +
        ' (' + Math.round((current / startingValue) * 100) + '%)';
    else
      text += starting.ambiguous ? ' / 시작 확인 필요' : hasStartingField ? ' / 시작 미입력' : ' / 시작 항목 없음';
    if (!hideMaximum && sanity.item.max !== null) text += ' / 최대 ' + sanity.item.max;
    return text;
  }

  function fieldValueText(characterId, item, raw, hideSanityMaximum) {
    if (item.kind === 'toggle') {
      var enabled = trim(item.onValue) ? trim(raw) === trim(item.onValue) : toggleValue(raw);
      return enabled === null ? trim(raw) : enabled ? '활성화' : '해제';
    }
    var current = numericFieldValue(characterId, raw);
    if (current === null) return trim(raw);
    var sanityText = sanityValueText(characterId, item, current, hideSanityMaximum);
    if (sanityText) return sanityText;
    return item.max !== null && item.max > 0
      ? current + ' / ' + item.max + ' (' + Math.round((current / item.max) * 100) + '%)'
      : String(current);
  }

  function resourceRawValue(characterId, item) {
    if (!item) return undefined;
    if (item.attribute) return item.attribute.get('current');
    var current = getAttr(characterId, item.name);
    return current === undefined || current === null ? item.value : current;
  }

  function resourceChangeContent(character, item, before, current, detail) {
    var beforeText = fieldValueText(character.id, item, before, true);
    var currentText = fieldValueText(character.id, item, current, true);
    var beforeNumber = numericFieldValue(character.id, before);
    var currentNumber = numericFieldValue(character.id, current);
    var delta = beforeNumber !== null && currentNumber !== null ? currentNumber - beforeNumber : 0;
    var deltaText = !delta || item.kind === 'toggle' ? ''
      : ' <span style="color:#aaa">(' + escapeHtml(Math.abs(delta)) + (delta > 0 ? ' 증가' : ' 감소') + ')</span>';
    var detailText = detail ? '<br><span style="color:#aaa">' + escapeHtml(detail) + '</span>' : '';
    return '<span style="font-size:10px;line-height:1.35;color:#969696"><b>' + escapeHtml(character.get('name')) + ' / ' + escapeHtml(item.label) +
      '</b> <span style="color:#b8b8b8">' + escapeHtml(beforeText) + '</span> → <b>' + escapeHtml(currentText) +
      '</b>' + deltaText + detailText + '</span>';
  }

  function sendTrackedChange(character, item, before, current, detail) {
    if (item.kind === 'toggle' &&
      fieldValueText(character.id, item, before) === fieldValueText(character.id, item, current)) return false;
    var settings = initState();
    if (settings.trackingMode === 'off') return false;
    if (!settings.trackGmOnly && !hasPlayerController(character)) return false;
    var content = resourceChangeContent(character, item, before, current, detail);
    sendChat(settings.trackingMode === 'gm' ? '시트 헬퍼' : '',
      settings.trackingMode === 'gm' ? '/w gm ' + content : '/desc ' + content, null);
    return true;
  }

  function suppressKey(characterId, name) {
    return characterId + '|' + name;
  }

  function setResourceValue(characterId, item, value) {
    var text = String(value);
    if (item.radioRange && (!isFinite(value) || Math.floor(Number(value)) !== Number(value) ||
        Number(value) < item.radioRange[0] || Number(value) > item.radioRange[1]))
      return { attribute: item.attribute || null, changed: false, error: '원본 시트에 없는 숫자 선택값입니다.' };
    var attribute = item.attribute;
    if (attribute && String(attribute.get('current') == null ? '' : attribute.get('current')) === text)
      return { attribute: attribute, changed: false };
    var key = suppressKey(characterId, item.name);
    var marker = { value: text };
    suppressedAttributeChanges[key] = marker;
    setTimeout(function () {
      if (suppressedAttributeChanges[key] === marker) delete suppressedAttributeChanges[key];
    }, 5000);
    if (!attribute) {
      var initial = getAttr(characterId, item.name);
      attribute = createObj('attribute', {
        characterid: characterId,
        name: item.name,
        current: String(initial == null ? '' : initial),
      });
    }
    if (!attribute) return { attribute: null, changed: false, error: '시트 수치를 저장하지 못했습니다.' };
    if (typeof attribute.setWithWorker === 'function') attribute.setWithWorker({ current: text });
    else attribute.set('current', text);
    return { attribute: attribute, changed: true };
  }

  function trackedRawValue(characterId, item) {
    return item && item.attribute
      ? item.attribute.get('current')
      : getAttr(characterId, item && item.name);
  }

  function trackedToggleEnabled(characterId, item) {
    if (!item) return false;
    var raw = trim(trackedRawValue(characterId, item));
    return trim(item.onValue) ? raw === trim(item.onValue) : toggleValue(raw) === true;
  }

  function activateTrackedToggle(character, item, detail, notifyChange) {
    if (!item || trackedToggleEnabled(character.id, item)) return false;
    var before = trackedRawValue(character.id, item);
    var next = trim(item.onValue) || '1';
    var saved = setResourceValue(character.id, item, next);
    if (!saved.changed) return false;
    item.attribute = saved.attribute;
    if (notifyChange !== false) sendTrackedChange(character, item, before, next, detail || '자동 활성화');
    return true;
  }

  function detectedRoleProblem(character, label, detected) {
    var suffix = detected && detected.ambiguous
      ? '같은 뜻의 항목이 여러 개입니다: ' + detected.matches.map(function (item) { return item.label; }).join(', ')
      : '해당 항목을 시트에서 찾지 못했습니다.';
    whisperGm('<b>' + escapeHtml(character.get('name')) + '</b> / ' + escapeHtml(label) + ' 자동 처리 생략: ' + escapeHtml(suffix));
    return label + ' 자동 처리 생략';
  }

  function successfulOutcome(result) {
    return result && ['critical', 'extreme', 'hard', 'success'].indexOf(result.outcome) > -1;
  }

  function finishAutomaticInsanity(payload, result, automation) {
    if (!successfulOutcome(result) || !automation || !automation.temporaryName) return;
    var character = getObj('character', payload.characterId);
    if (!character) return;
    var data = scan(character.id);
    if (automation.sourceHash && !sourceCandidateInspections(data.contractMatch).some(function (candidate) {
      return automation.sourceHash === candidate.contract.sourceHash;
    })) return;
    var longItem = automation.longName && data.trackedFields[automation.longName];
    if (longItem && trackedToggleEnabled(character.id, longItem)) return;
    var temporary = data.trackedFields[automation.temporaryName];
    if (!temporary || temporary.kind !== 'toggle') return;
    if (activateTrackedToggle(character, temporary, '지능 판정 성공으로 자동 활성화')) {
      invalidate(character.id);
      scheduleManager();
    }
  }

  function applyDetectedRules(character, changedItem, before, current, scannedData) {
    var data = scannedData || scan(character.id);
    var details = [];
    var beforeNumber = numericFieldValue(character.id, before);
    var currentNumber = numericFieldValue(character.id, current);
    if (beforeNumber === null || currentNumber === null || currentNumber >= beforeNumber) return details;

    var health = detectedFieldRole(data, 'health', 'number');
    var healthItem = health.item || health.matches.filter(function (item) {
      return item.name === changedItem.name;
    })[0];
    var changedHealth = healthItem && healthItem.name === changedItem.name;
    if (changedHealth) {
      var maximum = healthItem.max;
      var canCheckMajorDamage = maximum !== null && maximum > 0;
      if (!canCheckMajorDamage)
        details.push(detectedRoleProblem(character, '최대 체력', { ambiguous: false, matches: [] }));
      var major = detectedFieldRole(data, 'majorWound', 'toggle');
      var majorActive = major.item && trackedToggleEnabled(character.id, major.item);
      if (canCheckMajorDamage && beforeNumber - currentNumber >= maximum / 2 && !majorActive) {
        if (!major.item) details.push(detectedRoleProblem(character, '중상', major));
        else if (activateTrackedToggle(character, major.item, '최대 체력의 절반 이상 피해', false)) {
          majorActive = true;
          details.push('중상 활성화');
        }
      }
      if (currentNumber <= 0 && majorActive) {
        var dying = detectedFieldRole(data, 'dying', 'toggle');
        if (!dying.item) details.push(detectedRoleProblem(character, '빈사', dying));
        else if (activateTrackedToggle(character, dying.item, '체력 0 및 중상 상태', false)) details.push('빈사 활성화');
      }
      if (details.length) {
        invalidate(character.id);
        scheduleManager();
      }
      return details;
    }

    var sanity = detectedFieldRole(data, 'sanity', 'number');
    var sanityItem = sanity.item || sanity.matches.filter(function (item) {
      return item.name === changedItem.name;
    })[0];
    var changedSanity = sanityItem && sanityItem.name === changedItem.name;
    if (!changedSanity) return details;
    var longInsanity = detectedFieldRole(data, 'longInsanity', 'toggle');
    if (longInsanity.ambiguous) {
      details.push(detectedRoleProblem(character, '장기적 광기', longInsanity));
      return details;
    }
    var longActive = longInsanity.item && trackedToggleEnabled(character.id, longInsanity.item);
    var startingSanity = detectedFieldRole(data, 'startingSanity', 'number');
    var startingValue = startingSanity.item &&
      numericFieldValue(character.id, resourceRawValue(character.id, startingSanity.item));
    var longTriggered = !longActive && startingValue !== null && startingValue > 0 &&
      startingValue - currentNumber >= startingValue / 5;
    if (longTriggered) {
      if (!longInsanity.item) details.push(detectedRoleProblem(character, '장기적 광기', longInsanity));
      else if (activateTrackedToggle(character, longInsanity.item, '시작 이성의 5분의 1 이상 손실', false)) {
        details.push('장기적 광기 활성화');
        invalidate(character.id);
        scheduleManager();
      }
      longActive = true;
    }
    if (beforeNumber - currentNumber < 5) return details;
    if (longActive) return details;
    var intelligence = detectedRollRole(data, 'intelligence');
    if (!intelligence.item) {
      details.push(detectedRoleProblem(character, '지능 판정', intelligence));
      return details;
    }
    var temporary = detectedFieldRole(data, 'temporaryInsanity', 'toggle');
    if (!temporary.item) {
      details.push(detectedRoleProblem(character, '일시적 광기', temporary));
    }
    var rolled = executeContractInstance(character, intelligence.item, '', false);
    if (!rolled || !rolled.ok) {
      details.push('지능 판정을 실행하지 못함');
      return details;
    }
    if (rolled.payload && rolled.payload.resultTracking !== false) {
      rolled.payload._automaticInsanity = {
        sourceHash: rolled.payload.sourceHash || '',
        longName: longInsanity.item ? longInsanity.item.name : '',
        temporaryName: temporary.item ? temporary.item.name : '',
      };
      details.push('지능 판정 자동 실행');
    } else details.push('지능 판정은 실행했지만 결과를 자동 인식할 수 없음');
    return details;
  }

  function applyResourceChange(character, query, operator, expression) {
    var data = scan(character.id);
    var resolved = resolveResource(data, query);
    if (!resolved.ok) return resolved;
    var amount = rollAmount(expression);
    if (!amount.ok) return { ok: false, error: '변경값은 +2, -1d3, =50 형식으로 입력해 주세요.' };
    var item = resolved.item;
    var current = numericFieldValue(character.id, resourceRawValue(character.id, item));
    if (current === null) return { ok: false, error: item.label + ' 값이 숫자가 아닙니다.' };
    var next = operator === '+' ? current + amount.value : operator === '-' ? current - amount.value : amount.value;
    next = Math.round(next * 1000000) / 1000000;
    var saved = setResourceValue(character.id, item, next);
    if (saved.error) return { ok: false, error: saved.error };
    if (!saved.changed) return { ok: true, value: next, unchanged: true };
    item.attribute = saved.attribute;
    var details = amount.detail !== String(amount.value) ? [amount.detail] : [];
    details = details.concat(applyDetectedRules(character, item, current, next, data));
    sendTrackedChange(character, item, current, next, details.join(' / '));
    invalidate(character.id);
    scheduleManager();
    return { ok: true, value: next };
  }

  function handleGeneralChange(msg) {
    var content = trim(msg.content);
    if (content.charAt(0) !== ':') return false;
    var match = content.match(/^:\s*(.+?)\s*([+\-=])\s*(\d*d\d+|\d+(?:\.\d+)?)\s*$/i);
    if (!match) {
      whisper(msg, '수치 변경은 <code>:체력+3</code>, <code>:이성-1d3</code>, <code>:마력=10</code>처럼 입력해 주세요.');
      return true;
    }
    var resolved = resolveCharacter(msg, '');
    if (!resolved.ok) {
      reportResult(msg, resolved);
      return true;
    }
    reportResult(msg, applyResourceChange(resolved.character, match[1], match[2], match[3]));
    return true;
  }

 function bangBangChoiceHtml(choices) {
    var labels = { check: '판정', weapon: '무기', spell: '주문', armor: '방어구' };
    return '<b>어느 항목을 실행할까요?</b><br>' + choices.map(function (choice) {
      if (choice.kind === 'contract') {
        var contractCommand = '!시트 굴림선택|' + encodeURIComponent(choice.characterId) + '|' +
          encodeURIComponent(choice.contractId) + '|' + encodeURIComponent(choice.rollKey) + '|' +
          encodeURIComponent(choice.rowId || '') + '|' + encodeURIComponent(choice.modeId || '') + '|' +
          (choice.secret ? '1' : '0') + '|' + encodeURIComponent(choice.expression || '');
        return button(choice.label || choice.rollKey, contractCommand, '#111');
      }
      var command = '!시트 선택|' + encodeURIComponent(choice.characterId) + '|' + choice.kind + '|' +
        encodeURIComponent(choice.key) + '|' + (choice.secret ? '1' : '0') + '|' + encodeURIComponent(choice.mode || '');
      return button((choice.label || choice.key) + ' / ' + (labels[choice.kind] || choice.kind), command, '#111');
    }).join(' ');
  }

  function decodeCommandPart(value) {
    try {
      return { ok: true, value: decodeURIComponent(String(value == null ? '' : value)) };
    } catch (err) {
      return { ok: false, error: '선택 버튼 값이 올바르지 않습니다. 항목 이름을 다시 입력해 주세요.' };
    }
  }

  function handleLegacyAliasRoll(msg, body) {
    var resolved = resolveCharacter(msg, '');
    if (!resolved.ok || !usableContractInspection(inspectContracts(resolved.character.id))) return false;
    var contracted = resolveContractAction(resolved.character, body, false, { exactOnly: true });
    if (!contracted.handled) return false;
    reportResult(msg, contracted.result);
    return true;
  }

 function handleBangBang(msg, content) {
    var body = trim(content.substring(2));
    if (!body) {
      whisper(msg, helpHtml());
      return true;
    }
    if (safeRollExpression(body)) {
      var expressionCharacter = resolveCharacter(msg, '');
      if (expressionCharacter.ok) {
        var expressionContract = resolveContractAction(expressionCharacter.character, body, false, { exactOnly: true });
        if (expressionContract.handled) {
          reportResult(msg, expressionContract.result);
          return true;
        }
      }
      return false;
    }

    if (handleLegacyAliasRoll(msg, body)) return true;

    var search = body.match(/^검색(?:\s+(.+))?$/i);
    if (search) {
      if (!trim(search[1])) return reportResult(msg, { ok: false, error: '찾을 이름을 적어 주세요. 입력 예: !!검색 관찰' });
      handleNamespaced(msg, '!시트 검색|' + trim(search[1]));
      return true;
    }

    var tracking = body.match(/^(변화알림|추적)\s+(공개|public|show|GM|비공개|hide|끄기|해제|off)$/i);
    if (tracking) {
      handleNamespaced(msg, '!시트 변화알림|' + tracking[2]);
      return true;
    }
    var gmTracking = body.match(/^(GM캐릭터알림|GM전용추적)\s+(켜기|on|표시|show|끄기|해제|off|숨김|hide)$/i);
    if (gmTracking) {
      handleNamespaced(msg, '!시트 GM캐릭터알림|' + gmTracking[2]);
      return true;
    }

    var direct = body.match(/^(도움말|help|관리|새로고침|상태|목록|점검)$/i);
    if (direct) {
      handleNamespaced(msg, '!시트 ' + direct[1]);
      return true;
    }
    var managed = body.match(/^(화자|캐릭터|전환)\s+(.+)$/i);
    if (managed) {
      handleNamespaced(msg, '!시트 ' + managed[1] + '|' + trim(managed[2]));
      return true;
    }

    var secret = false;
    var secretMatch = body.match(/^비밀\s+(.+)$/);
    if (secretMatch) {
      secret = true;
      body = trim(secretMatch[1]);
    }

    var original = body.match(/^원본\s+(.+)$/);
    if (original) body = trim(original[1]);

    var freeExpression = body.match(/^r(?:\s+(.+))?$/i);
    if (freeExpression) {
      if (!trim(freeExpression[1]))
        return reportResult(msg, { ok: false, error: '자유 주사위 식을 적어 주세요. 입력 예: !!r 2d6+3' });
      return withCharacter(msg, '', function (character) {
        var contracted = executeContractExpression(character, freeExpression[1], secret);
        return contracted || { ok: false, error: SHEET_NOT_RECOGNIZED };
      });
    }

    return withCharacter(msg, '', function (character) {
      var contracted = resolveContractAction(character, body, secret);
      if (!contracted.handled) {
        var categorized = body.match(/^(?:판정|무기|주문|방어구)\s+(.+)$/);
        if (categorized) contracted = resolveContractAction(character, trim(categorized[1]), secret);
      }
      if (contracted.handled) return contracted.result;
      if (contracted.inspection && !usableContractInspection(contracted.inspection) && contracted.inspection.status === 'ambiguous')
        return { ok: false, error: contracted.inspection.error };
      return {
        ok: false,
        error: contracted.inspection && usableContractInspection(contracted.inspection)
          ? '현재 시트에서 ' + trim(body) + ' 굴림을 찾지 못했습니다.'
          : SHEET_NOT_RECOGNIZED,
      };
    });
  }

  function handleNamespaced(msg, content) {
    var parts = content.substring(3).split('|').map(trim);
    var action = normalize(parts.shift() || '도움말');
    if (action === '추적') action = '변화알림';
    else if (action === 'gm전용추적') action = 'gm캐릭터알림';
    if (action === '도움말' || action === 'help') return whisper(msg, helpHtml());
    if (action === '검색')
      return withCharacter(msg, '', function (character) {
        var checked = ensureSheet(character);
        if (!checked.ok) return checked;
        whisper(msg, searchHtml(checked.data, parts[0]));
        return { ok: true };
      });
    if (action === '점검') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      var inspected = resolveInspectionCharacter(msg);
      if (!inspected.ok) return reportResult(msg, inspected);
      return reportResult(msg, (function (character) {
        var recognition = inspectContracts(character.id);
        if (!usableContractInspection(recognition))
          return { ok: false, error: recognition.error || SHEET_NOT_RECOGNIZED };
        whisper(msg, inspectionHtml(scan(character.id, true)));
        return { ok: true };
      })(inspected.character));
    }
    if (action === '굴림목록' || action === '계약목록') {
      var listCharacter = decodeCommandPart(parts[0]);
      var listLabel = decodeCommandPart(parts[1]);
      if (!listCharacter.ok || !listLabel.ok)
        return reportResult(msg, !listCharacter.ok ? listCharacter : listLabel);
      return withCharacter(msg, listCharacter.value, function (character) {
        var inspection = inspectContracts(character.id);
        if (!usableContractInspection(inspection))
          return { ok: false, error: inspection.error || SHEET_NOT_RECOGNIZED };
        var matches = preferredContractRolls(scan(character.id)).filter(function (instance) {
          return normalize(instance.label) === normalize(listLabel.value);
        }).map(function (instance) {
          instance.characterId = character.id;
          return { instance: instance };
        });
        if (!matches.length) return { ok: false, error: '선택한 굴림이 바뀌었습니다. 관리 화면을 다시 열어 주세요.' };
        if (matches.length === 1) return executeContractInstance(character, matches[0].instance, '', parts[2] === '1');
        return contractConflict(matches, parts[2] === '1');
      });
    }
    if (action === '굴림선택' || action === '계약선택') {
      var contractCharacter = decodeCommandPart(parts[0]);
      var contractId = decodeCommandPart(parts[1]);
      var contractRollKey = decodeCommandPart(parts[2]);
      var contractRowId = decodeCommandPart(parts[3]);
      var contractModeId = decodeCommandPart(parts[4]);
      var contractExpression = decodeCommandPart(parts[6]);
      var invalidContractPart = [contractCharacter, contractId, contractRollKey, contractRowId, contractModeId, contractExpression]
        .filter(function (part) { return !part.ok; })[0];
      if (invalidContractPart) return reportResult(msg, invalidContractPart);
      if (!contractCharacter.value || !contractId.value || !contractRollKey.value)
        return reportResult(msg, { ok: false, error: '선택한 굴림 정보가 비어 있습니다. 항목을 다시 선택해 주세요.' });
      return withCharacter(msg, contractCharacter.value, function (character) {
        return executeContract(
          character.id,
          contractId.value,
          contractRollKey.value,
          contractRowId.value,
          contractModeId.value,
          parts[5] === '1',
          contractExpression.value,
        );
      });
    }
    if (action === '변화알림') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      var trackingMode = normalize(parts[0]);
      if (/^(?:공개|public|show)$/.test(trackingMode)) initState().trackingMode = 'public';
      else if (/^(?:gm|비공개|hide)$/.test(trackingMode)) initState().trackingMode = 'gm';
      else if (/^(?:끄기|해제|off)$/.test(trackingMode)) initState().trackingMode = 'off';
      else return whisperGm('변화 알림은 공개, GM, 끄기 중 하나를 골라 주세요.');
      initState().managerHash = '';
      managerHandout();
      return whisperGm('수치 변화 알림: <b>' + (initState().trackingMode === 'public' ? '전체 공개' : initState().trackingMode === 'gm' ? 'GM만' : '끄기') + '</b>');
    }
    if (action === 'gm캐릭터알림') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      var gmTracking = normalize(parts[0]);
      if (/^(?:켜기|on|표시|show)$/.test(gmTracking)) initState().trackGmOnly = true;
      else if (/^(?:끄기|해제|off|숨김|hide)$/.test(gmTracking)) initState().trackGmOnly = false;
      else return whisperGm('GM 전용 캐릭터 알림은 켜기 또는 끄기를 골라 주세요.');
      initState().managerHash = '';
      managerHandout();
      return whisperGm('플레이어 권한이 없는 GM 캐릭터 변화 알림: <b>' + (initState().trackGmOnly ? '켜기' : '끄기') + '</b>');
    }
    if (action === '관리') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      return whisperGm(openManager());
    }
    if (action === '새로고침') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      invalidate();
      initState().managerHash = '';
      managerHandout();
      return whisperGm('시트 항목을 다시 읽었습니다.');
    }
    if (action === '화자' || action === '캐릭터' || action === '전환')
      return switchSpeaker(msg, parts[0]);
    if (action === '현황보기' || action === '관리대상') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      if (!getObj('character', parts[0])) return whisperGm('캐릭터를 찾지 못했습니다.');
      initState().managerCharacterId = parts[0];
      initState().managerHash = '';
      managerHandout();
      return;
    }
    if (action === '상태' || action === '목록')
      return withCharacter(msg, '', function (character) {
        var checked = ensureSheet(character);
        if (!checked.ok) return checked;
        whisper(msg, statusHtml(checked.data));
        return { ok: true };
      });
    if (action === '판정' || action === '비밀판정')
      return withCharacter(msg, '', function (character) {
        return rollCheck(character.id, parts[0], { secret: action === '비밀판정', mode: parts[1] });
      });
    if (action === '무기' || action === '비밀무기')
      return withCharacter(msg, '', function (character) { return rollWeapon(character.id, parts[0], action === '비밀무기'); });
    if (action === '주문' || action === '비밀주문')
      return withCharacter(msg, '', function (character) { return showSpell(character.id, parts[0], action === '비밀주문'); });
    if (action === '방어구' || action === '비밀방어구')
      return withCharacter(msg, '', function (character) { return rollArmor(character.id, parts[0], action === '비밀방어구'); });
    return whisper(msg, '알 수 없는 시트 명령입니다.<br>' + helpHtml());
  }

  function handleLegacy(msg, content) {
    if (content.indexOf('!!') === 0) return handleBangBang(msg, content);
    if (content === '!s' || /^!s\s+/.test(content)) {
      var secretTarget = trim(content.substring(2));
      if (/^[\d(]/.test(secretTarget)) return false;
      withCharacter(msg, '', function (character) { return rollCheck(character.id, secretTarget, { secret: true }); });
      return true;
    }
    var match = content.match(/^!(?:atk|무기)\s+(.+)$/i);
    if (match) {
      withCharacter(msg, '', function (character) { return rollWeapon(character.id, match[1], false); });
      return true;
    }
    if (/^!(?:status|skills|기능|weapons)$/.test(content)) {
      withCharacter(msg, '', function (character) {
        whisper(msg, statusHtml(scan(character.id)));
        return { ok: true };
      });
      return true;
    }
    return false;
  }

  function contractRelevant(name) {
    var wanted = trim(name);
    if (!wanted) return false;
    var catalog = recognitionCatalog(sheetContracts());
    return !!catalog.exact[wanted] || triePrefixes(catalog.prefixes, wanted).length > 0;
  }

  function trackAttributeChange(attribute, previous, scannedData) {
    if (!attribute || !previous) return;
    var characterId = attribute.get('_characterid');
    var name = trim(attribute.get('name'));
    var current = String(attribute.get('current') == null ? '' : attribute.get('current'));
    var before = String(previous.current == null ? '' : previous.current);
    if (!characterId || before === current) return;
    var key = suppressKey(characterId, name);
    if (suppressedAttributeChanges[key]) {
      if (suppressedAttributeChanges[key].value === current) {
        delete suppressedAttributeChanges[key];
        return;
      }
      delete suppressedAttributeChanges[key];
    }
    if (!contractRelevant(name)) return;
    var data = scannedData || scan(characterId);
    var item = data.trackedFields && data.trackedFields[name];
    if (!item) return;
    item = data.resourcesByAttribute && data.resourcesByAttribute[name] || item;
    var character = getObj('character', characterId);
    if (!character) return;
    var details = applyDetectedRules(character, item, before, current, data);
    sendTrackedChange(character, item, before, current, details.join(' / '));
  }

  function cachedUntrackedToggle(characterId, name) {
    var data = cache[characterId];
    var candidates = data && sourceCandidateInspections(data.contractMatch);
    if (!candidates || !candidates.length || data.trackedFields && data.trackedFields[name]) return false;
    return candidates.every(function (candidate) {
      var field = contractRuntimeIndex(candidate.contract).fieldGlobal[name];
      return !!(field && /^(?:checkbox|radio)$/i.test(trim(field.type)));
    });
  }

  function flushAttributeChanges() {
    attributeChangeTimer = null;
    var changes = pendingAttributeOrder.map(function (key) { return pendingAttributeChanges[key]; });
    pendingAttributeChanges = {};
    pendingAttributeOrder = [];
    if (!changes.length) return;

    var allMembershipChanged = changes.some(function (change) { return change.membershipChanged; });
    var affected = {};
    changes.forEach(function (change) { affected[change.characterId] = true; });
    if (allMembershipChanged) invalidate();
    else Object.keys(affected).forEach(function (characterId) { invalidate(characterId); });

    var scanned = {};
    changes.forEach(function (change) {
      if (!change.previous || change.presentationOnly ||
        change.membershipChanged && change.previous.current === undefined) return;
      var data = scanned[change.characterId];
      if (!data) data = scanned[change.characterId] = scan(change.characterId);
      if (!data.ok || cachedUntrackedToggle(change.characterId, change.name)) return;
      trackAttributeChange(change.attribute, change.previous, data);
    });
    scheduleManager();
  }

  function onAttributeChanged(attribute, previous, membershipChanged) {
    var name = trim(attribute && attribute.get('name'));
    var characterId = attribute && attribute.get('_characterid');
    membershipChanged = !!membershipChanged || !!(previous && own(previous, 'name') && trim(previous.name) !== name);
    if (!characterId || (!membershipChanged && !contractRelevant(name))) return;
    var key = characterId + '|' + name;
    var pending = pendingAttributeChanges[key];
    var presentationOnly = !membershipChanged && cachedUntrackedToggle(characterId, name);
    invalidate(characterId);
    if (!pending) {
      pending = pendingAttributeChanges[key] = {
        attribute: attribute,
        previous: previous,
        membershipChanged: membershipChanged,
        presentationOnly: presentationOnly,
        characterId: characterId,
        name: name,
      };
      pendingAttributeOrder.push(key);
    } else {
      pending.attribute = attribute;
      if (!pending.previous && previous) pending.previous = previous;
      pending.membershipChanged = pending.membershipChanged || membershipChanged;
      pending.presentationOnly = pending.presentationOnly && presentationOnly;
    }
    if (attributeChangeTimer) clearTimeout(attributeChangeTimer);
    attributeChangeTimer = setTimeout(flushAttributeChanges, 25);
  }

  api.version = VERSION;
  api.scan = scan;
  api.roll = rollCheck;
  api.rollWeapon = rollWeapon;
  api.showSpell = showSpell;
  api.rollArmor = rollArmor;
  api.rollFree = rollFree;
  api.cutinItems = cutinItems;
  api.outcomes = OUTCOMES;
  api.registerContract = registerContract;
  api.sheetContracts = sheetContracts;
  api.inspectContracts = function (characterId) {
    return inspectContracts(characterId);
  };
  api.contractRolls = function (characterId) {
    return commonContractRolls(characterId, inspectContracts(characterId), false);
  };
  api.exactContractInstance = exactContractInstance;
  api.qualifyContractMacro = qualifyContractMacro;
  api.executeContract = executeContract;
  api.resolveContractAction = resolveContractAction;
  api.refresh = function () {
    invalidate();
    initState().managerHash = '';
    initState().playerHelpHash = '';
    var manager = managerHandout();
    playerHelpHandout();
    return manager;
  };

  function registerAdapter() {
    var adapter = {
      meta: { code: '10_sheet_helper.js', title: '시트 헬퍼' },
      aliases: { 시트: '', sheet: '' },
      status: function () {
        return { sheets: sheetContracts().length };
      },
      cutinItems: cutinItems,
      outcomes: function () { return OUTCOMES; },
      refresh: api.refresh,
      help: [
        '<code>!!도움말</code> PL용과 GM용 명령어 확인',
        '<code>!!굴릴항목이름</code> 현재 시트의 굴림 실행',
        '<code>!!비밀 굴릴항목이름</code> 현재 시트의 굴림을 GM에게 실행',
        '<code>!!검색 이름</code> 항목과 현재 수치 검색',
        '<code>!!상태</code> PL용 현재 시트의 항목과 수치 확인',
        '<code>:수치이름+3</code> 내 캐릭터 수치 변경',
        '<code>!!점검</code> GM용 시트 인식 점검',
        '<code>!!화자 이름</code> GM용 채팅 화자 전환',
        '<code>!!화자 본인</code> 캐릭터 화자를 해제하고 GM 오너 프로필로 복귀',
        '<code>!!변화알림 공개|GM|끄기</code> 수치 변화 알림 공개 범위 설정',
        '<code>!!GM캐릭터알림 켜기|끄기</code> 플레이어 권한이 없는 GM 캐릭터도 알림에 포함',
        '<code>!!관리</code> GM용 인식 항목 관리',
      ],
    };
    if (typeof KIBScene.register === 'function') KIBScene.register('sheet', adapter);
    else {
      KIBScene.adapters = KIBScene.adapters || {};
      KIBScene.adapters.sheet = adapter;
    }
  }

  on('ready', function () {
    if (!sheet_helper_setting.enabled) return;
    initState();
    registerAdapter();
    if (typeof KIBScene.refreshHandout === 'function') KIBScene.refreshHandout();
    var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
    if (cutin && typeof cutin.refreshSheetControls === 'function')
      cutin.refreshSheetControls();
    scheduleManager();
  });

  on('chat:message', function (msg) {
    if (!sheet_helper_setting.enabled || !msg) return;
    try {
      if (msg.type !== 'api' && captureResult(msg)) return;
      var content = trim(msg.content);
      if (!content) return;
      if (msg.type === 'general' && handleGeneralChange(msg)) return;
      if (msg.type === 'api') {
        if (/^!시트(?:$|\s|\|)/.test(content)) return handleNamespaced(msg, content);
        if (sheet_helper_setting.legacy_commands) handleLegacy(msg, content);
      }
    } catch (err) {
      whisperGm('시트 헬퍼 오류: ' + escapeHtml(err && err.message ? err.message : err));
    }
  });

  on('add:character', function (character) {
    invalidate();
    scheduleManager();
  });
  on('destroy:character', function (character) {
    invalidate();
    if (initState().managerCharacterId === character.id) initState().managerCharacterId = '';
    scheduleManager();
  });
  on('add:attribute', function (attribute) {
    onAttributeChanged(attribute, null, true);
  });
  on('change:attribute', function (attribute, previous) {
    onAttributeChanged(attribute, previous || null);
  });
  on('destroy:attribute', function (attribute) {
    onAttributeChanged(attribute, null, true);
  });
  on('destroy:handout', function (handout) {
    if (initState().managerId === handout.id) {
      initState().managerId = '';
      initState().managerHash = '';
    }
    if (initState().playerHelpId === handout.id) {
      initState().playerHelpId = '';
      initState().playerHelpHash = '';
    }
  });
})(KIBSheetHelper);
